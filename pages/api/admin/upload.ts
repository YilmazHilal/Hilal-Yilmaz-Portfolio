import type { NextApiRequest, NextApiResponse } from 'next';
import { requireApiAuth } from '@/lib/auth';
import { saveBinary } from '@/lib/content';
import { safeUploadName } from '@/lib/validate';

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } },
};

const MAX_BYTES = 4 * 1024 * 1024;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireApiAuth(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename, dataBase64 } = (req.body ?? {}) as {
    filename?: unknown;
    dataBase64?: unknown;
  };

  if (typeof filename !== 'string' || typeof dataBase64 !== 'string' || !dataBase64) {
    return res.status(400).json({ error: 'filename and dataBase64 are required.' });
  }

  const safe = safeUploadName(filename);
  if (!safe) {
    return res
      .status(400)
      .json({ error: 'Unsupported file type (png, jpg, gif, webp, svg, pdf).' });
  }

  if (Buffer.byteLength(dataBase64, 'base64') > MAX_BYTES) {
    return res.status(413).json({ error: 'File too large (max 4MB).' });
  }

  try {
    const mode = await saveBinary(
      `public/uploads/${safe}`,
      dataBase64,
      `chore(admin): upload ${safe}`
    );
    return res.status(200).json({ ok: true, mode, path: `/uploads/${safe}` });
  } catch (error) {
    return res
      .status(502)
      .json({ error: error instanceof Error ? error.message : 'Upload failed' });
  }
}
