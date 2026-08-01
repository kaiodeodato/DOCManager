# Runbook — Deploy no Render (E15.04)

## Serviços (`render.yaml`)

| Serviço | Tipo | Build | Start |
|---------|------|-------|-------|
| `doc-manager-web` | web | `npm ci && npm run build -- --filter=@ac/web` | `npm run start --workspace=@ac/web` |
| `doc-manager-worker-ocr` | worker | `npm ci && npm run build -- --filter=@ac/worker-ocr` | `npm run start --workspace=@ac/worker-ocr` |
| `doc-manager-worker-notify` | worker (adicionar) | `npm ci && npm run build -- --filter=@ac/worker-notify` | `WORKER_NOTIFY_POLL=1 npm run start --workspace=@ac/worker-notify` |

## Variáveis

- `NODE_VERSION=20`
- Web: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (quando Auth ligar)
- Workers: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DEEPSEEK_API_KEY` (ocr/classify)
- Notify: `SMTP_URL` (opcional), `TWILIO_*` (opcional) — **não** definir `NOTIFY_ALLOW_SMTP` / `NOTIFY_ALLOW_TWILIO` até smoke manual
- OCR poll: `WORKER_OCR_POLL=1` no start do worker-ocr se necessário

## Procedimento

1. Ligar blueprint / sync do repo no Render.
2. Aplicar migrations Supabase (`supabase db push` ou CI).
3. Deploy web → smoke `/` e `/api/documents`.
4. Deploy worker-ocr → verificar logs JSON (`createLogger`).
5. Deploy worker-notify → enfileirar job `notify` de teste.
6. Confirmar alertas de jobs stuck (`findStuckJobs`) se houver painel.

## Rollback

- Re-deploy do commit anterior no Render Dashboard.
- Migrations: só forward-fix; não apagar `audit_log`.

## Smoke pós-deploy

- `GET /` 200
- `GET /manifest.webmanifest` 200
- `POST /api/pdf/jobs` 202 com enqueueMs baixo
- Worker logs sem stack traces recorrentes
