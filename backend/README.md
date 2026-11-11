# KNOWFLOW API

Express + TypeScript API. All `/api` routes require a Supabase access token in the `Authorization: Bearer` header. See `../docs/architecture/MVP_IMPLEMENTATION.md` for the route list and Supabase setup.

```bash
npm ci
cp .env.example .env
npm run dev
```

The API uses the Supabase service-role key server-side only. Every data route performs explicit user, organisation, project, role, source and recipient checks before returning protected data.
