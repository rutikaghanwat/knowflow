import type { ErrorRequestHandler } from 'express';
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File exceeds the upload size limit.' });
  if (err?.message === 'Only PDF and DOCX files are supported.') return res.status(415).json({ error: err.message });
  if (err?.name === 'ZodError') return res.status(400).json({ error: 'Invalid request.', details: err.issues });
  const status = Number(err?.statusCode) || 500;
  if (status >= 500) console.error('Request failed:', err?.message || err);
  res.status(status).json({ error: status >= 500 ? 'An unexpected server error occurred.' : err.message });
};
