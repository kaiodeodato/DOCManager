# Go-live checklist (E15.05)

## Produto / Eng

- [ ] E0–E15 backend tickets em **Concluído IA** + revisão humana crítica
- [ ] UI design system + layouts mínimos em produção
- [ ] Contratos `@ac/shared` alinhados web ↔ workers
- [ ] Migrations aplicadas (incl. FTS, RLS, audit triggers)
- [ ] Vitest / node:test verde na CI
- [ ] Playwright smoke a verde (ou skip documentado se sem browser no CI)

## Segurança / RGPD

- [ ] RLS review checklist (`Doc/architecture/rls-review-checklist.md`)
- [ ] RGPD checklist staging (`Doc/rgpd-checklist.md`)
- [ ] Secrets só no Render / Supabase; nenhum `.env` no repo
- [ ] Signed URLs para partilha externa; viewer sem share

## Operação

- [ ] Runbook Render seguido (`Doc/runbook-render.md`)
- [ ] Logs estruturados nos workers
- [ ] Alertas de jobs stuck configurados
- [ ] Backup / PITR Supabase activo
- [ ] Contacto on-call definido

## Aceitação

- [ ] Upload → OCR → classify (ou needs_review) no staging
- [ ] Pesquisa documentos
- [ ] Relatório PDF `/api/reports`
- [ ] Notify stub → email console em staging
- [ ] Assistente `/api/assistant` com tools
