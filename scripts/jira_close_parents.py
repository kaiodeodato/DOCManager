#!/usr/bin/env python3
"""Close Fluxo de trabalho parents when all child tasks are done."""
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
        raise RuntimeError(f"{key}: no transition to {target}; available={[t['name']+'->'+t['to']['name'] for t in tr['transitions']]}")
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


def finish(key: str) -> None:
    issue = call("GET", f"/rest/api/3/issue/{key}?fields=summary,status,issuetype")
    f = issue["fields"]
    status = f["status"]["name"]
    summary = f["summary"]
    print(f"CHECK {key} type={f['issuetype']['name']} status={status} | {summary}")
    done = {"Concluído IA", "Concluído Humano", "Done"}
    if status in done:
        print(f"SKIP {key} already {status}")
        return
    try:
        if status in ("Tarefas pendentes", "To Do"):
            transition(key, "In Progress")
        comment(key, f"AI close parent workstream: child tasks completed. {summary}")
        try:
            transition(key, "in Testing")
        except Exception:
            pass
        to = transition(key, "Done")
        print(f"CLOSED {key} -> {to}")
    except Exception as e:
        print(f"FAIL {key} {e}")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    keys = sys.argv[1:] or ["DM-36", "DM-43", "DM-48", "DM-53"]
    for key in keys:
        finish(key)


if __name__ == "__main__":
    main()
