import type { NextFunction, Response } from 'express';
import type { AuthedRequest } from '../types.js';
import { supabase } from '../config/supabase.js';

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  // Explicitly forward rejected promises; Express 4 does not do this automatically.
  void supabase.auth.getUser(token).then(({ data, error }) => {
    if (error || !data.user?.email) return res.status(401).json({ error: 'Session is invalid or expired.' });
    req.user = { id: data.user.id, email: data.user.email };
    next();
  }).catch(next);
}
