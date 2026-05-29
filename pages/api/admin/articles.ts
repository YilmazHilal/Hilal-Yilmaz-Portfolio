import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/auth';
import { loadJson, saveJson, ARTICLES_FILE } from '@/lib/content';
import { sanitizeArticles } from '@/lib/validate';
import type { Article } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) return;

  if (req.method === 'GET') {
    const articles = await loadJson<Article[]>(ARTICLES_FILE, []);
    return res.status(200).json({ articles });
  }

  if (req.method === 'PUT') {
    const articles = sanitizeArticles((req.body ?? {}).articles);
    if (!articles) {
      return res
        .status(400)
        .json({ error: 'Invalid articles payload (each article needs a title).' });
    }
    try {
      const mode = await saveJson(
        ARTICLES_FILE,
        articles,
        'chore(admin): update articles'
      );
      return res.status(200).json({ ok: true, mode, articles });
    } catch (error) {
      return res
        .status(502)
        .json({ error: error instanceof Error ? error.message : 'Failed to save' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
