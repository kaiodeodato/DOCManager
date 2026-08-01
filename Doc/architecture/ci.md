# CI pipeline (E0.07)

## Goal

Run monorepo quality gates on every pull request with Turbo caching.

## Workflow

`.github/workflows/ci.yml`

Triggers: `pull_request`, `push` to `main`/`master`.

Steps:

1. Checkout
2. Node 20 + npm cache
3. `npm ci`
4. Turbo cache restore (`.turbo`)
5. `npm run lint`
6. `npm run typecheck`
7. `npm run test`
8. `npm run build`

## Local parity

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

## Notes

- Turbo task graph already wires `dependsOn: ["^build"]` for lint/typecheck/test.
- Keep CI Node version aligned with `engines.node` (`>=22`).
