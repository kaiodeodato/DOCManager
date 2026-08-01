# UAT — E6 taxonomy

## Objective

Owner can edit taxonomy; classify prompt receives it; old docs unchanged.

## Steps

1. Open `/settings/taxonomy`, save a custom type
2. `GET /api/taxonomy?orgId=` returns config
3. Run shared taxonomy immutability tests
4. Confirm existing document `documentType` unchanged after save

## Expected

- Config per org isolated in store
- Custom type appears in `buildClassifyPrompt`
- `assertTaxonomyChangeLeavesDocumentsIntact` passes
