const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export type AuthSession = { access_token: string; refresh_token: string; expires_at?: number; user: { id: string; email?: string; user_metadata?: Record<string, unknown> } };
const SESSION_KEY = 'knowflow_session';

export function getSession(): AuthSession | null {
  try { const raw = localStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) as AuthSession : null; }
  catch { return null; }
}
export function saveSession(session: AuthSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

async function authRequest(path: string, body: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.local before signing in.');
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY }, body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || 'Authentication failed.');
  return data;
}
export async function signIn(email: string, password: string): Promise<AuthSession> {
  const data = await authRequest('token?grant_type=password', { email, password });
  if (!data.access_token) throw new Error('Sign-in did not return a session. Check your email confirmation and Supabase Auth settings.');
  const session = { ...data, expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600) } as AuthSession;
  saveSession(session); return session;
}
export async function signUp(email: string, password: string, fullName: string, role = 'Project Manager') {
  const data = await authRequest('signup', { email, password, data: { full_name: fullName, role, perspective: 'manager' } });
  if (data.access_token) {
    const session = { ...data, expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600) } as AuthSession;
    saveSession(session);
  }
  return data;
}
export function signOut() {
  const current = getSession();
  if (current?.access_token && SUPABASE_URL && SUPABASE_ANON_KEY) {
    void fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${current.access_token}` } }).catch(() => undefined);
  }
  saveSession(null);
}

export async function requestPasswordReset(email: string) {
  await authRequest(`recover?redirect_to=${encodeURIComponent(`${window.location.origin}/reset-password`)}`, { email });
}
export async function updatePasswordFromRecovery(password: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Supabase Auth is not configured in the frontend.');
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const token = params.get('access_token');
  if (!token || params.get('type') !== 'recovery') throw new Error('This password reset link is invalid or has expired. Request a new link.');
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { method: 'PUT', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` }, body: JSON.stringify({ password }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.message || 'Could not update your password.');
}

let refreshInFlight: Promise<AuthSession | null> | null = null;
async function refreshSession(): Promise<AuthSession | null> {
  const current = getSession();
  if (!current?.refresh_token) return null;
  if (!refreshInFlight) {
    refreshInFlight = authRequest('token?grant_type=refresh_token', { refresh_token: current.refresh_token })
      .then(data => { if (!data.access_token) return null; const next = { ...data, expires_at: Math.floor(Date.now()/1000) + Number(data.expires_in || 3600) } as AuthSession; saveSession(next); return next; })
      .catch(() => null).finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let session = getSession();
  if (!session?.access_token) throw new Error('Your session has expired. Please sign in again.');
  if (session.expires_at && session.expires_at < Math.floor(Date.now()/1000) + 60) session = await refreshSession();
  if (!session?.access_token) { signOut(); throw new Error('Your session has expired. Please sign in again.'); }
  const send = (token: string) => { const headers = new Headers(options.headers); headers.set('Authorization', `Bearer ${token}`); if (options.body !== undefined && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json'); return fetch(`${API_URL}${path}`, { ...options, headers }); };
  let response = await send(session.access_token);
  if (response.status === 401) { const refreshed = await refreshSession(); if (refreshed?.access_token) response = await send(refreshed.access_token); }
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) { signOut(); window.location.assign('/login?session=expired'); }
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status}).`);
  return data as T;
}
export const jsonBody = (value: unknown) => JSON.stringify(value);
