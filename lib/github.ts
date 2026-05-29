const API = 'https://api.github.com';

interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

function getConfig(): RepoConfig | null {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) return null;
  const owner =
    process.env.GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER || 'YilmazHilal';
  const repo =
    process.env.GITHUB_REPO ||
    process.env.VERCEL_GIT_REPO_SLUG ||
    'Hilal-Yilmaz-Portfolio';
  const branch =
    process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main';
  return { owner, repo, branch, token };
}

export function isGithubConfigured(): boolean {
  return getConfig() !== null;
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

export async function githubGetFile(
  filePath: string
): Promise<{ content: string; sha: string } | null> {
  const cfg = getConfig();
  if (!cfg) throw new Error('GitHub is not configured');

  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}?ref=${encodeURIComponent(
    cfg.branch
  )}`;
  const res = await fetch(url, { headers: authHeaders(cfg.token) });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub GET ${filePath} failed: ${res.status} ${await res.text()}`);
  }

  const json = await res.json();
  return {
    content: Buffer.from(json.content, 'base64').toString('utf-8'),
    sha: json.sha,
  };
}

export async function githubPutFile(
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  const cfg = getConfig();
  if (!cfg) throw new Error('GitHub is not configured');

  const existing = await githubGetFile(filePath);

  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: cfg.branch,
  };
  if (existing) body.sha = existing.sha;

  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders(cfg.token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GitHub PUT ${filePath} failed: ${res.status} ${await res.text()}`);
  }
}

export async function githubPutFileBase64(
  filePath: string,
  base64Content: string,
  message: string
): Promise<void> {
  const cfg = getConfig();
  if (!cfg) throw new Error('GitHub is not configured');

  const body: Record<string, unknown> = {
    message,
    content: base64Content,
    branch: cfg.branch,
  };

  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${filePath}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: authHeaders(cfg.token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GitHub PUT ${filePath} failed: ${res.status} ${await res.text()}`);
  }
}
