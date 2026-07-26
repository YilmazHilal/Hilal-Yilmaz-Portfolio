import type {
  Article,
  LocaleContent,
  Project,
  SiteSettings,
  SocialLink,
} from '@/types';

const asString = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Best-effort HTML hardening for the few fields rendered via
 * dangerouslySetInnerHTML. Strips dangerous tags, inline event handlers and
 * javascript: URLs while keeping simple formatting (spans, links). The primary
 * control is still admin authentication; this is defense-in-depth.
 */
function safeHtml(value: string): string {
  return value
    .replace(
      /<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      ''
    )
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)\b[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(
      /(href|src)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,
      '$1="#"'
    );
}

/** Allow only safe schemes for clickable URLs; drop javascript:/data:/etc. */
function safeUrl(value: string): string {
  const v = value.trim();
  if (!v) return '';
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (v.startsWith('/') || v.startsWith('#')) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return ''; // disallowed scheme
  return v; // scheme-less, treated as relative
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeProjects(input: unknown): Project[] | null {
  if (!Array.isArray(input)) return null;
  const out: Project[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const o = item as Record<string, unknown>;
    const title = asString(o.title).trim();
    if (!title) return null;
    const project: Project = {
      title,
      description: asString(o.description),
      logo: asString(o.logo),
      link: safeUrl(asString(o.link)),
      slug: asString(o.slug).trim() || slugify(title),
    };
    const image = asString(o.image).trim();
    if (image) project.image = image;
    out.push(project);
  }
  return out;
}

export function sanitizeArticles(input: unknown): Article[] | null {
  if (!Array.isArray(input)) return null;
  const out: Article[] = [];
  for (const item of input) {
    if (!item || typeof item !== 'object') return null;
    const o = item as Record<string, unknown>;
    const title = asString(o.title).trim();
    if (!title) return null;
    out.push({
      id: asString(o.id).trim() || slugify(title),
      title,
      description: asString(o.description),
      cover_image: asString(o.cover_image),
      url: safeUrl(asString(o.url)),
    });
  }
  return out;
}

function sanitizeLocale(input: unknown): LocaleContent | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;
  const home = (o.home ?? {}) as Record<string, unknown>;
  const about = (o.about ?? {}) as Record<string, unknown>;
  return {
    home: {
      role: asString(home.role),
      bio: asString(home.bio),
    },
    about: {
      profile_title: asString(about.profile_title),
      profile_text: safeHtml(asString(about.profile_text)),
      experience_title: asString(about.experience_title),
      experience_text: safeHtml(asString(about.experience_text)),
      philosophy_title: asString(about.philosophy_title),
      philosophy_text: asString(about.philosophy_text),
      beyond_title: asString(about.beyond_title),
      beyond_text: asString(about.beyond_text),
    },
  };
}

export function sanitizeSettings(input: unknown): SiteSettings | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;
  const content = (o.content ?? {}) as Record<string, unknown>;
  const en = sanitizeLocale(content.en);
  const tr = sanitizeLocale(content.tr);
  if (!en || !tr) return null;
  if (!Array.isArray(o.socials)) return null;

  const socials: SocialLink[] = [];
  for (const s of o.socials) {
    if (!s || typeof s !== 'object') return null;
    const so = s as Record<string, unknown>;
    const social = asString(so.social).trim();
    if (!social) return null;
    socials.push({
      social,
      link: asString(so.link),
      href: safeUrl(asString(so.href)),
    });
  }

  const identityIn = (o.identity ?? {}) as Record<string, unknown>;
  const cvUrlEn = safeUrl(asString(identityIn.cvUrlEn));
  const cvUrlTr = safeUrl(asString(identityIn.cvUrlTr));
  const identity = {
    name: asString(identityIn.name),
    aboutSubtitle: asString(identityIn.aboutSubtitle),
    profileImage: safeUrl(asString(identityIn.profileImage)),
    cvUrl: cvUrlEn || cvUrlTr || safeUrl(asString(identityIn.cvUrl)),
    cvUrlEn,
    cvUrlTr,
  };

  return { identity, content: { en, tr }, socials };
}

const ALLOWED_UPLOAD_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf'];

export function safeUploadName(filename: string): string | null {
  const ext = (filename.split('.').pop() ?? '').toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.includes(ext)) return null;
  const base = filename.slice(0, filename.length - ext.length - 1);
  const cleanBase =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';
  return `${Date.now()}-${cleanBase}.${ext}`;
}
