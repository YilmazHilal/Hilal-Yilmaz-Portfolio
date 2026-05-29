import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/auth';
import { loadJson, saveJson, SETTINGS_FILE } from '@/lib/content';
import { sanitizeSettings } from '@/lib/validate';
import type { SiteSettings } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) return;

  if (req.method === 'GET') {
    const settings = await loadJson<SiteSettings | null>(SETTINGS_FILE, null);
    return res.status(200).json({ settings });
  }

  if (req.method === 'PUT') {
    const settings = sanitizeSettings((req.body ?? {}).settings);
    if (!settings) {
      return res.status(400).json({ error: 'Invalid settings payload.' });
    }
    try {
      const mode = await saveJson(
        SETTINGS_FILE,
        settings,
        'chore(admin): update site settings'
      );
      return res.status(200).json({ ok: true, mode, settings });
    } catch (error) {
      return res
        .status(502)
        .json({ error: error instanceof Error ? error.message : 'Failed to save' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
