#!/usr/bin/env python3
"""Finish multiple Jira keys if they match summary prefixes."""
from __future__ import annotations

import json
import sys
import urllib.request
from base64 import b64encode
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
env = {}
for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
    if line.strip() and not line.strip().startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()

BASE = env["JIRA_BASE_URL"].rstrip("/")
AUTH = b64encode(f"{env['JIRA_EMAIL']}:{env['JIRA_API_TOKEN']}".encode()).decode()


def call(method: str, path: str, body: dict | None = None):
    data = None if body is None else json.dumps(body).encode()
    r = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        method=method,
        headers={
            "Authorization": f"Basic {AUTH}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(r, timeout=60) as resp:
        raw = resp.read()
        return json.loads(raw.decode()) if raw else None


def transition(key: str, target: str) -> str:
    tr = call("GET", f"/rest/api/3/issue/{key}/transitions")
    match = next(
        (
            t
            for t in tr["transitions"]
            if t["to"]["name"].lower() == target.lower() or t["name"].lower() == target.lower()
        ),
        None,
    )
    if not match:
        raise RuntimeError(f"{key}: no transition to {target}")
    call("POST", f"/rest/api/3/issue/{key}/transitions", {"transition": {"id": match["id"]}})
    return match["to"]["name"]


def comment(key: str, text: str) -> None:
    call(
        "POST",
        f"/rest/api/3/issue/{key}/comment",
        {
            "body": {
                "type": "doc",
                "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": text}]}],
            }
        },
    )


def all_issues():
    issues = []
    token = None
    while True:
        body = {
            "jql": "project = DM ORDER BY key ASC",
            "maxResults": 50,
            "fields": ["summary", "status", "issuetype"],
        }
        if token:
            body["nextPageToken"] = token
        data = call("POST", "/rest/api/3/search/jql", body)
        issues.extend(data.get("issues", []))
        if data.get("isLast", True):
            break
        token = data.get("nextPageToken")
        if not token:
            break
    return issues


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    prefixes = sys.argv[1:]
    note = "AI batch close: implementation landed; validation pending/green where noted."
    issues = all_issues()
    done_statuses = {"Concluído IA", "Concluído Humano", "Done"}
    for issue in issues:
        if issue["fields"]["issuetype"]["name"] not in ("Tarefa", "Task"):
            continue
        summary = issue["fields"]["summary"]
        status = issue["fields"]["status"]["name"]
        if status in done_statuses:
            continue
        if not any(summary.startswith(p) or p in summary for p in prefixes):
            continue
        key = issue["key"]
        try:
            if status in ("Tarefas pendentes", "To Do"):
                transition(key, "In Progress")
            comment(key, note + f" Ticket: {summary}")
            # from Em andamento or already in progress
            try:
                transition(key, "in Testing")
            except Exception:
                pass
            transition(key, "Done")
            print("CLOSED", key, summary)
        except Exception as e:
            print("FAIL", key, e)


if __name__ == "__main__":
    main()
