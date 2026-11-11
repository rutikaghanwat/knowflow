# KNOWFLOW MVP completion checklist

Legend: `[x]` implemented in code; `[ ]` requires external setup or remains incomplete; `[~]` partially implemented / not fully verified.

## Application

- [x] Real Supabase email/password sign-in and sign-up flow
- [x] Token refresh and sign-out
- [x] Password reset request and recovery password update
- [x] Protected application shell
- [x] Organisation creation
- [x] Project creation and project roles
- [x] Add existing registered users to a project
- [x] PDF/DOCX upload and evidence-first extraction
- [x] Source listing and source-role access configuration
- [x] Findings review, verification and dismissal
- [x] Permission-filtered role-specific handover generation
- [x] Manager approval / change request API and UI
- [x] Approved report access for assigned recipient
- [x] Durable recipient acknowledgement and audit event
- [x] Manager and employee workspaces use live API data for the primary handover flow
- [x] Shared plum/lavender UI treatment across existing pages

## External setup required

- [ ] Configure Supabase URL and keys in local environment files
- [ ] Apply migrations `001`–`010`
- [ ] Create private `knowflow-sources` Storage bucket
- [ ] Configure Supabase email confirmation and password recovery redirect URLs
- [ ] Install frontend/backend dependencies successfully and run production builds
- [ ] Run live tests with separate manager, departing and incoming accounts

## Remaining product scope

- [ ] GitHub OAuth and authorised repository ingestion
- [ ] Email invitations and invitation token lifecycle
- [ ] Source delete/download and background processing retry
- [ ] Persisted departing-member clarification notes
- [ ] Profile editing, notification preferences and full organisation settings
- [ ] Full audit-log viewer
- [ ] Semantic role relevance ranking and richer conflict/outdated-evidence detection
- [ ] OCR for scanned PDFs

## Verification status

- [x] AI Python compile check
- [x] AI unit tests (2 passed)
- [x] AI DOCX extraction smoke test through FastAPI TestClient
- [x] Frontend TS/JSX syntax transpilation (58 files)
- [x] Backend TypeScript syntax transpilation (9 files)
- [ ] Frontend full type check and production build (dependency installation timed out in the work environment)
- [ ] Backend full type check and production build (dependency installation not completed)
- [ ] Live Supabase integration / end-to-end scenario (credentials not supplied)
