#!/usr/bin/env python3
"""Jira helpers: list open tasks, start, finish."""
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
        raise SystemExit(f"{key}: no transition to {target}")
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


def list_open(limit: int = 500) -> list[dict]:
    issues: list[dict] = []
    next_token = None
    while len(issues) < limit:
        body: dict = {
            "jql": "project = DM ORDER BY key ASC",
            "maxResults": min(50, limit - len(issues)),
            "fields": ["summary", "status", "issuetype"],
        }
        if next_token:
            body["nextPageToken"] = next_token
        data = call("POST", "/rest/api/3/search/jql", body)
        batch = data.get("issues", [])
        for i in batch:
            if i["fields"]["issuetype"]["name"] not in ("Tarefa", "Task"):
                continue
            if i["fields"]["status"]["name"] in ("Concluído IA", "Concluído Humano", "Done"):
                continue
            issues.append(i)
        next_token = data.get("nextPageToken")
        if data.get("isLast", True) or not batch:
            break
    return issues[:limit]


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    cmd = sys.argv[1]
    if cmd == "list":
        issues = list_open()
        print(len(issues))
        for i in issues:
            print(f"{i['key']}\t{i['fields']['status']['name']}\t{i['fields']['summary']}")
    elif cmd == "start":
        key = sys.argv[2]
        print(transition(key, "In Progress"))
        if len(sys.argv) > 3:
            comment(key, sys.argv[3])
    elif cmd == "finish":
        key = sys.argv[2]
        if len(sys.argv) > 3:
            comment(key, sys.argv[3])
        print(transition(key, "in Testing"))
        print(transition(key, "Done"))
    else:
        raise SystemExit("list|start|finish")


if __name__ == "__main__":
    main()
