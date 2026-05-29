import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/auth';
import { loadJson, saveJson, PROJECTS_FILE } from '@/lib/content';
import { sanitizeProjects } from '@/lib/validate';
import type { Project } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) return;

  if (req.method === 'GET') {
    const projects = await loadJson<Project[]>(PROJECTS_FILE, []);
    return res.status(200).json({ projects });
  }

  if (req.method === 'PUT') {
    const projects = sanitizeProjects((req.body ?? {}).projects);
    if (!projects) {
      return res
        .status(400)
        .json({ error: 'Invalid projects payload (each project needs a title).' });
    }
    try {
      const mode = await saveJson(
        PROJECTS_FILE,
        projects,
        'chore(admin): update projects'
      );
      return res.status(200).json({ ok: true, mode, projects });
    } catch (error) {
      return res
        .status(502)
        .json({ error: error instanceof Error ? error.message : 'Failed to save' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
