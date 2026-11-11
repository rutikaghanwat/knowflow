# KNOWFLOW — Evidence-based knowledge handover

KNOWFLOW preserves authorised project knowledge and transfers it to incoming team members through evidence-linked, role-aware handover reports.

## Repository

- `frontend/` — React + TypeScript application. The authenticated manager and recipient workflows use the backend API rather than seeded dashboard data.
- `backend/` — Express API. It verifies Supabase access tokens and enforces organisation, project, source, role, approval and recipient access.
- `ai-service/` — FastAPI PDF/DOCX extraction service. It produces conservative, evidence-first candidate findings; it does not invent confidence scores or project facts.
- `database/migrations/` — ordered Supabase PostgreSQL migrations (`001`–`010`).
- `docs/architecture/MVP_IMPLEMENTATION.md` — setup, API contracts, security boundaries and remaining limitations.

## Local setup

### 1. Supabase

1. Create a Supabase project.
2. Apply every SQL file in `database/migrations/` in numeric order, including `010_handover_acknowledgements.sql`.
3. Enable email/password authentication. Configure the email confirmation and password recovery redirect URLs for your frontend origin (for local development: `http://localhost:5173`).
4. Create a **private** Storage bucket named `knowflow-sources`.
5. Copy the Supabase project URL, anon key and service-role key. The service-role key belongs only in the backend environment.

### 2. Backend API

```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

Fill `backend/.env` with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and a random `AI_SERVICE_API_KEY` of at least 24 characters. Keep this file private.

### 3. AI service

```bash
cd ai-service
python -m venv .venv
# Activate the virtual environment for your operating system
pip install -r requirements.txt
```

Set `AI_SERVICE_API_KEY` in `ai-service/.env` to the same value used by the backend, then run:

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev
```

Set these Vite variables in `frontend/.env.local`:

- `VITE_API_URL=http://localhost:3001/api`
- `VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co`
- `VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY`

Never put `SUPABASE_SERVICE_ROLE_KEY` in the frontend.

## MVP flow

1. A manager registers; Supabase Auth provisions their profile and KNOWFLOW creates their organisation.
2. The manager creates a project. System roles are created and the manager is added as a project member.
3. The manager adds existing KNOWFLOW accounts to the project and assigns roles.
4. The manager uploads text-based PDF or DOCX sources. The API validates file type/signature, stores the file in private Supabase Storage and calls the authenticated AI service.
5. Candidate findings are stored with source excerpts and page references. A manager can verify or dismiss findings and restrict a source to a selected project role.
6. The manager generates a handover for two active project members and a target role. The backend filters restricted evidence before composing the report.
7. The manager approves or requests changes. Only an approved report is visible to its assigned recipient.
8. The incoming member reviews the report and acknowledges it. The acknowledgement and manager decision are recorded in the audit log.

## Verification

- AI unit tests: `cd ai-service && python -m unittest discover -s tests -v`.
- AI syntax check: `cd ai-service && python -m compileall -q app tests`.
- Frontend production build: `cd frontend && npm ci && npm run build`.
- Backend production build: `cd backend && npm ci && npm run build`.

A successful local build is not proof of a configured Supabase end-to-end run. Configure real Supabase credentials and test with separate manager, departing and incoming accounts before presenting a live demo.
