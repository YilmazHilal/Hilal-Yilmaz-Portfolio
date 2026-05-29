import type { NextApiRequest, NextApiResponse } from 'next';
import {
  adminConfigured,
  createToken,
  setSessionCookie,
  verifyPassword,
} from '@/lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!adminConfigured()) {
    return res
      .status(500)
      .json({ error: 'ADMIN_PASSWORD is not configured on the server.' });
  }

  const password = (req.body ?? {}).password;
  if (typeof password !== 'string' || !verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  setSessionCookie(res, createToken());
  return res.status(200).json({ ok: true });
}
