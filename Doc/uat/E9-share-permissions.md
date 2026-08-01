# UAT — E9 share & permissions

## Objective

Validate signed share URLs and role gates.

## Preconditions

- Web app running; no Supabase env required (fake signed URL mode)

## Steps

1. As owner/accountant, `POST /api/share` with orgId + documentId → 200 + `mode: fake|supabase`
2. As viewer, same request with `role: viewer` → 403
3. Optional: subscribeDocumentStatus with memory channel receives events

## Expected

- Viewer never receives a signed URL
- Fake URL host is `signed.local` when env absent
