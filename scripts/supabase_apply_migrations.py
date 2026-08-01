#!/usr/bin/env python3
"""
Apply DOC Manager SQL migrations to a Postgres database (Supabase).

Requires one of:
  DATABASE_URL
  SUPABASE_DB_URL
  SUPABASE_DB_PASSWORD (+ optional SUPABASE_DB_HOST / project ref from NEXT_PUBLIC_SUPABASE_URL)

Usage:
  python scripts/supabase_apply_migrations.py
  python scripts/supabase_apply_migrations.py --verify-only
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "supabase" / "migrations"

EXPECTED_TABLES = [
    "orgs",
    "org_members",
    "documents",
    "document_jobs",
    "document_extractions",
    "document_extractions_corrections",
    "document_tags",
    "audit_log",
    "tenant_taxonomy_config",
]


def load_env() -> dict[str, str]:
    env = dict(os.environ)
    env_path = ROOT / ".env"
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.strip().startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env.setdefault(k.strip(), v.strip())
    return env


def resolve_database_url(env: dict[str, str]) -> str:
    for key in ("DATABASE_URL", "SUPABASE_DB_URL", "SUPABASE_DB_CONNECTION_STRING"):
        if env.get(key):
            return env[key]

    password = env.get("SUPABASE_DB_PASSWORD") or env.get("POSTGRES_PASSWORD")
    if not password:
        raise SystemExit(
            "Missing DB credentials. Add DATABASE_URL or SUPABASE_DB_PASSWORD to .env\n"
            "Dashboard → Project Settings → Database → Connection string (URI) / Database password."
        )

    url = env.get("NEXT_PUBLIC_SUPABASE_URL") or env.get("SUPABASE_URL") or ""
    match = re.search(r"https://([a-z0-9]+)\.supabase\.co", url)
    ref = match.group(1) if match else env.get("SUPABASE_PROJECT_REF")
    if not ref:
        raise SystemExit("Could not infer project ref from NEXT_PUBLIC_SUPABASE_URL")

    host = env.get("SUPABASE_DB_HOST", "aws-0-eu-west-1.pooler.supabase.com")
    user = env.get("SUPABASE_DB_USER", f"postgres.{ref}")
    # Prefer session mode (5432) for DDL/migrations; 6543 is transaction pooler.
    port = env.get("SUPABASE_DB_PORT", "5432")
    db = env.get("SUPABASE_DB_NAME", "postgres")
    pwd = urllib.parse.quote_plus(password)
    return f"postgresql://{user}:{pwd}@{host}:{port}/{db}?sslmode=require"


def migration_files() -> list[Path]:
    return sorted(MIGRATIONS.glob("*.sql"))


def apply(url: str) -> None:
    try:
        import psycopg
    except ImportError:
        raise SystemExit("Install psycopg first: pip install psycopg[binary]")

    files = migration_files()
    if not files:
        raise SystemExit(f"No migrations in {MIGRATIONS}")

    print(f"Applying {len(files)} migrations…")
    with psycopg.connect(url) as conn:
        conn.execute(
            """
            create table if not exists public.schema_migrations (
              filename text primary key,
              applied_at timestamptz not null default now()
            )
            """
        )
        for path in files:
            name = path.name
            exists = conn.execute(
                "select 1 from public.schema_migrations where filename = %s",
                (name,),
            ).fetchone()
            if exists:
                print(f"SKIP {name}")
                continue
            sql = path.read_text(encoding="utf-8")
            print(f"APPLY {name}…")
            with conn.transaction():
                conn.execute(sql)
                conn.execute(
                    "insert into public.schema_migrations (filename) values (%s)",
                    (name,),
                )
            print(f"OK   {name}")
        conn.commit()
    print("All migrations applied.")


def verify(url: str) -> int:
    try:
        import psycopg
    except ImportError:
        raise SystemExit("Install psycopg first: pip install psycopg[binary]")

    missing: list[str] = []
    with psycopg.connect(url) as conn:
        for table in EXPECTED_TABLES:
            row = conn.execute(
                """
                select 1 from information_schema.tables
                where table_schema = 'public' and table_name = %s
                """,
                (table,),
            ).fetchone()
            if row:
                print(f"OK table {table}")
            else:
                print(f"MISSING table {table}")
                missing.append(table)

        # RLS enabled?
        for table in EXPECTED_TABLES:
            row = conn.execute(
                "select relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname='public' and c.relname=%s",
                (table,),
            ).fetchone()
            if row and row[0]:
                print(f"OK rls {table}")
            else:
                print(f"WARN rls off/missing {table}")

        # FTS column
        row = conn.execute(
            """
            select 1 from information_schema.columns
            where table_schema='public' and table_name='documents' and column_name='search_vector'
            """
        ).fetchone()
        print("OK documents.search_vector" if row else "MISSING documents.search_vector")
        if not row:
            missing.append("documents.search_vector")

        # Storage bucket
        try:
            row = conn.execute("select 1 from storage.buckets where id = 'documents'").fetchone()
            print("OK storage.buckets.documents" if row else "MISSING storage.buckets.documents")
            if not row:
                missing.append("storage.buckets.documents")
        except Exception as e:
            print(f"WARN storage check failed: {e}")

    return 1 if missing else 0


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify-only", action="store_true")
    args = parser.parse_args()
    env = load_env()
    url = resolve_database_url(env)
    # Never print password
    safe = re.sub(r":([^:@/]+)@", ":***@", url)
    print(f"Using {safe}")
    if not args.verify_only:
        apply(url)
    code = verify(url)
    raise SystemExit(code)


if __name__ == "__main__":
    main()
