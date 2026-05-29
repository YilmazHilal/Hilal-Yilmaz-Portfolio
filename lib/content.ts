import fs from 'fs/promises';
import path from 'path';
import {
  githubGetFile,
  githubPutFile,
  githubPutFileBase64,
  isGithubConfigured,
} from './github';

export const PROJECTS_FILE = 'data/projects.json';
export const ARTICLES_FILE = 'data/articles.json';
export const SETTINGS_FILE = 'data/settings.json';

function localPath(file: string): string {
  return path.join(process.cwd(), file);
}

/**
 * Reads the live committed state from GitHub when a token is configured,
 * otherwise falls back to the local file (used during `next dev`).
 */
export async function loadJson<T>(file: string, fallback: T): Promise<T> {
  if (isGithubConfigured()) {
    const res = await githubGetFile(file);
    if (!res) return fallback;
    return JSON.parse(res.content) as T;
  }
  try {
    const raw = await fs.readFile(localPath(file), 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type SaveMode = 'github' | 'local';

/**
 * Persists data by committing to GitHub (which triggers a redeploy) when a
 * token is configured, otherwise writes to the local file for development.
 */
export async function saveJson(
  file: string,
  data: unknown,
  message: string
): Promise<SaveMode> {
  const content = JSON.stringify(data, null, 2) + '\n';
  if (isGithubConfigured()) {
    await githubPutFile(file, content, message);
    return 'github';
  }
  await fs.writeFile(localPath(file), content, 'utf-8');
  return 'local';
}

/**
 * Persists a binary file (e.g. an uploaded image) the same way as saveJson:
 * commit to GitHub when configured, otherwise write to the local filesystem.
 */
export async function saveBinary(
  file: string,
  base64: string,
  message: string
): Promise<SaveMode> {
  if (isGithubConfigured()) {
    await githubPutFileBase64(file, base64, message);
    return 'github';
  }
  const full = localPath(file);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, Buffer.from(base64, 'base64'));
  return 'local';
}
