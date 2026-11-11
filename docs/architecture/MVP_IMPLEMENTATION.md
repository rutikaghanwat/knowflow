# KNOWFLOW MVP implementation notes

## Implemented in this repository

### Frontend

- The existing React + TypeScript application and route structure are preserved.
- The authenticated workspace now uses a shared plum/lavender design direction and responsive layouts.
- Supabase email/password sign-in, sign-up, token refresh, sign-out and password recovery are connected through the Supabase Auth HTTP API.
- The manager overview, projects, team roster, source ingestion, knowledge analysis, project state, evidence audit, handovers, reports and approvals use live backend API calls.
- The recipient overview, approved report, permitted evidence, project summary, acknowledgement, departing handover and accessible files use live API calls.
- Demo role switching, seeded dashboard metrics, mock notifications, and fake approval/acknowledgement success states were removed from the authenticated workflows.
- Unavailable functions are identified rather than presented as successful mock operations.

### Backend

- Express API with Helmet, CORS, rate limiting, request logging and JSON size limits.
- Supabase Auth token verification on every `/api/*` request.
- Organisation and project membership checks before protected queries.
- Project creation and role provisioning; add an existing registered user to a project with a selected role.
- PDF/DOCX validation, private Storage upload, AI-service call, chunk storage and evidence-linked findings.
- Source-role access configuration and permission filtering before findings are returned or reports are generated.
- Finding verification/dismissal, role-specific handover generation, manager decisions, report recipient access and acknowledgement.
- Manager decisions and recipient acknowledgement are written to the append-only audit log.

### AI service

- FastAPI health endpoint and service-key protected extraction endpoint.
- Text extraction for PDF and DOCX, chunking, candidate task/decision/risk/blocker/dependency/responsibility/question excerpts.
- No fabricated project facts or confidence percentages. Candidate findings require manager review.

### Database

- Existing migrations `001`–`009` are retained.
- Migration `010_handover_acknowledgements.sql` adds durable recipient acknowledgement records and enables RLS with default-deny direct client access.

## Run locally

1. Apply `database/migrations/001_...sql` through `010_...sql` to Supabase in order.
2. Create a private `knowflow-sources` Storage bucket.
3. Configure `backend/.env` using `backend/.env.example`.
4. Configure `ai-service/.env` using `ai-service/.env.example`; its `AI_SERVICE_API_KEY` must match the backend value.
5. Configure `frontend/.env.local` using `frontend/.env.example`.
6. Start AI service on port `8000`, backend on port `3001`, and frontend on port `5173`.

## API routes

All `/api/*` routes require `Authorization: Bearer <Supabase access token>`.

- `GET /health`
- `GET /api/me`
- `GET, POST /api/organizations`
- `GET /api/organizations/:orgId/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `GET, POST /api/projects/:projectId/members`
- `GET, POST /api/projects/:projectId/sources`
- `PUT /api/projects/:projectId/sources/:sourceId/permissions`
- `GET /api/projects/:projectId/findings`
- `PATCH /api/findings/:findingId`
- `GET /api/projects/:projectId/roles`
- `GET, POST /api/handovers`
- `GET /api/reports/:reportId`
- `POST /api/reports/:reportId/decision`
- `POST /api/handovers/:handoverId/acknowledge`

## Security boundaries

- Supabase service-role credentials are used only by the backend. The frontend uses the public anon key for Auth only.
- The private Storage bucket must not be made public.
- Every project-scoped route verifies project and organisation membership. Manager-only operations also verify a manager/owner/admin project role.
- Restricted-source evidence is removed unless the target role has an explicit `source_role_permissions.can_read=true` grant. Project managers retain manager-level access for review and remediation. Role relevance is applied after permission filtering.
- Recipient report access is checked on the report endpoint and only approved reports are returned to recipients by the handover list endpoint.
- Acknowledgement is accepted only from the assigned target user and only after approval.
- RLS remains enabled with default-deny direct PostgREST access; the API's explicit authorization checks are essential because its service-role client bypasses RLS.

## Known limitations / manual setup

- GitHub OAuth and repository ingestion are not implemented. The frontend does not ask users to paste GitHub tokens or arbitrary repository URLs.
- Email invitations are not implemented. A manager can add an already registered account by email; the recipient must register first.
- Source deletion, source download, organisation settings, profile editing, notification preferences and a full audit-log viewer are not implemented.
- Departing-member clarification notes are not persisted; the review page is read-only and does not pretend to submit them.
- Scanned PDFs need OCR, which is not enabled. PDF extraction works only when embedded text is available.
- Extraction is rule-based and conservative, not LLM-based. It may miss implied tasks or decisions that lack explicit markers.
- Role-specific relevance is currently a lightweight keyword/category filter. It is not a semantic ranking system.
- The UI allows a manager to restrict a source to one selected project role. Configure and test each role's access before generating handovers.
- The source upload route is synchronous. Large documents or slow AI processing may need a background job queue for production scale.
- The current frontend session is stored in browser local storage by the Supabase Auth REST flow. Use a hardened deployment with strict CSP, HTTPS, secure domain configuration and XSS prevention.
- Password recovery requires the local/deployed frontend URL to be allow-listed in Supabase Auth redirect settings.

## Verification performed in this work session

- AI service Python compilation: passed.
- AI unit tests: 2 passed.
- AI DOCX extraction smoke test through FastAPI TestClient: passed (1 document, 1 chunk, 3 candidate findings).
- Frontend TypeScript/JSX transpile syntax check across 57 `.ts`/`.tsx` files: passed (syntax only; not a full type check).
- Backend TypeScript transpile syntax check across 9 source files: passed (syntax only; not a full type check).
- Frontend and backend dependency installation timed out in this environment. Therefore `npm run build`, full TypeScript type-checking and production bundles were not verified.
- No Supabase credentials were provided, so live authentication, database migrations, uploads, role filtering, approval and acknowledgement have not been exercised end to end.
