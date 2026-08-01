# E14.04 — Checklist RGPD (staging)

## Objetivo

Validar direitos RGPD contra um ambiente staging com dados representativos (não produção).

## Pré-condições

- Org de teste + utilizador `owner`
- Documentos de exemplo com PII (nome fornecedor, NIF em extracções)
- Endpoint `/api/gdpr` disponível
- Triggers `audit_log` aplicados

## Checklist

- [ ] **Transparência**: política de privacidade / retention documentada para o tenant
- [ ] **Minimização**: só campos necessários no upload + extracção
- [ ] **Acesso (Art. 15)**: `POST /api/gdpr` action `export` devolve JSON do tenant/utilizador
- [ ] **Apagamento / anonimização (Art. 17)**: action `anonymize` remove/mascara PII; Storage object purge planeada
- [ ] **Portabilidade (Art. 20)**: export JSON legível por máquina
- [ ] **Auditoria**: alterações sensíveis aparecem em `audit_log` (documents, org_members)
- [ ] **Retenção**: jobs e logs com TTL acordado
- [ ] **Subcontratantes**: Supabase / Twilio / email SMTP listados no DPA
- [ ] **Transferências**: regiões EU confirmadas no projeto Supabase / Render
- [ ] **Segurança**: RLS + signed URLs + sem service-role no browser

## Evidência sugerida

Guardar timestamps + issue keys no ticket E14.04 após smoke em staging.
