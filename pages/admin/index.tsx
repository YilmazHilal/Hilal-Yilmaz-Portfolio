import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next';
import { VscGripper } from 'react-icons/vsc';

import { isAuthed } from '@/lib/auth';
import type {
  AboutContent,
  Article,
  HomeContent,
  LocaleContent,
  Project,
  SiteSettings,
} from '@/types';
import styles from '@/styles/Admin.module.css';

type Locale = 'en' | 'tr';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
];

const ABOUT_FIELDS: { key: keyof AboutContent; label: string; multiline: boolean }[] = [
  { key: 'profile_title', label: 'Profile — title', multiline: false },
  { key: 'profile_text', label: 'Profile — text (HTML allowed)', multiline: true },
  { key: 'experience_title', label: 'Experience — title', multiline: false },
  { key: 'experience_text', label: 'Experience — text (HTML allowed)', multiline: true },
  { key: 'philosophy_title', label: 'Philosophy — title', multiline: false },
  { key: 'philosophy_text', label: 'Philosophy — text', multiline: true },
  { key: 'beyond_title', label: 'Beyond Code — title', multiline: false },
  { key: 'beyond_text', label: 'Beyond Code — text', multiline: true },
];

function saveMessage(mode?: string): string {
  return mode === 'github'
    ? 'Saved — committed to GitHub. Your site redeploys automatically (~1 min).'
    : 'Saved locally (development mode).';
}

/* ----------------------------- Toasts ----------------------------- */

type ToastKind = 'ok' | 'error';
type ToastItem = { id: number; message: string; kind: ToastKind };
type ToastApi = { show: (message: string, kind?: ToastKind) => void };

const ToastContext = createContext<ToastApi | null>(null);

function useToast(): ToastApi {
  return useContext(ToastContext) ?? { show: () => {} };
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, kind: ToastKind = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`${styles.toast} ${
              t.kind === 'error' ? styles.toastError : styles.toastOk
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------- Hooks & helpers ------------------------ */

function useUnsavedWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) {
    return arr;
  }
  const next = [...arr];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function RemoveButton({ onRemove }: { onRemove: () => void }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button
        className={styles.dangerButton}
        onClick={() => setConfirming(true)}
        type="button"
      >
        Remove
      </button>
    );
  }
  return (
    <span className={styles.confirmRow}>
      <button className={styles.dangerButton} onClick={onRemove} type="button">
        Confirm
      </button>
      <button
        className={styles.ghostButton}
        onClick={() => setConfirming(false)}
        type="button"
      >
        Cancel
      </button>
    </span>
  );
}

function DragHandle({
  index,
  dragIndex,
}: {
  index: number;
  dragIndex: React.MutableRefObject<number | null>;
}) {
  return (
    <span
      className={styles.dragHandle}
      draggable
      onDragStart={() => {
        dragIndex.current = index;
      }}
      onDragEnd={() => {
        dragIndex.current = null;
      }}
      title="Drag to reorder"
      aria-label="Drag to reorder"
    >
      <VscGripper />
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {multiline ? (
        <textarea
          className={styles.textarea}
          value={value}
          rows={4}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function UploadField({
  label,
  value,
  onChange,
  placeholder,
  accept = 'image/*',
  preview = 'image',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  accept?: string;
  preview?: 'image' | 'link';
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const dataBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
        reader.onerror = () => reject(new Error('read error'));
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, dataBase64 }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        onChange(data.path);
      } else {
        setError(data.error || 'Upload failed.');
      }
    } catch {
      setError('Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.uploadRow}>
        <input
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className={styles.uploadButton}>
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept={accept}
            hidden
            disabled={uploading}
            onChange={onFile}
          />
        </label>
      </div>
      {preview === 'image' && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className={styles.preview} />
      )}
      {preview === 'link' && value && (
        <a
          className={styles.previewLink}
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          View current file
        </a>
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

function emptyLocale(): LocaleContent {
  return {
    home: { role: '', bio: '' },
    about: {
      profile_title: '',
      profile_text: '',
      experience_title: '',
      experience_text: '',
      philosophy_title: '',
      philosophy_text: '',
      beyond_title: '',
      beyond_text: '',
    },
  };
}

function emptySettings(): SiteSettings {
  return {
    identity: { name: '', aboutSubtitle: '', cvUrl: '', cvUrlEn: '', cvUrlTr: '' },
    content: { en: emptyLocale(), tr: emptyLocale() },
    socials: [],
  };
}

function ProjectsEditor({ active }: { active: boolean }) {
  const [items, setItems] = useState<Project[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const toast = useToast();
  useUnsavedWarning(dirty);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setItems(data.projects);
      } else {
        toast.show('Failed to load projects.', 'error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(i: number, field: keyof Project, value: string) {
    setItems((prev) =>
      prev ? prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)) : prev
    );
    setDirty(true);
  }

  function add() {
    setItems((prev) => [
      ...(prev ?? []),
      { title: '', description: '', logo: '', image: '', link: '', slug: '' },
    ]);
    setDirty(true);
  }

  function remove(i: number) {
    setItems((prev) => (prev ? prev.filter((_, idx) => idx !== i) : prev));
    setDirty(true);
  }

  function reorder(from: number, to: number) {
    setItems((prev) => (prev ? move(prev, from, to) : prev));
    setDirty(true);
  }

  async function save() {
    if (!items) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: items }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setItems(data.projects);
        setDirty(false);
        toast.show(saveMessage(data.mode), 'ok');
      } else {
        toast.show(data.error || 'Save failed.', 'error');
      }
    } catch {
      toast.show('Network error.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ display: active ? 'block' : 'none' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Projects{dirty && <span className={styles.dirtyDot} title="Unsaved changes" />}
        </h2>
        <div className={styles.sectionActions}>
          <button className={styles.ghostButton} onClick={add} type="button">
            + Add project
          </button>
          <button
            className={styles.primaryButton}
            onClick={save}
            type="button"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save projects'}
          </button>
        </div>
      </div>
      {items === null ? (
        <p className={styles.muted}>Loading…</p>
      ) : items.length === 0 ? (
        <p className={styles.muted}>No projects yet. Add one above.</p>
      ) : (
        items.map((p, i) => (
          <div
            className={styles.card}
            key={i}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex.current !== null) reorder(dragIndex.current, i);
              dragIndex.current = null;
            }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <DragHandle index={i} dragIndex={dragIndex} />
                <span className={styles.cardTitle}>{p.title || 'Untitled project'}</span>
              </div>
              <RemoveButton onRemove={() => remove(i)} />
            </div>
            <div className={styles.grid2}>
              <Field label="Title" value={p.title} onChange={(v) => update(i, 'title', v)} />
              <Field
                label="Slug"
                value={p.slug}
                onChange={(v) => update(i, 'slug', v)}
                placeholder="auto from title if empty"
              />
              <Field
                label="Link"
                value={p.link}
                onChange={(v) => update(i, 'link', v)}
                placeholder="https://…"
              />
              <UploadField
                label="Logo path"
                value={p.logo}
                onChange={(v) => update(i, 'logo', v)}
                placeholder="/logos/example.svg"
              />
              <UploadField
                label="Cover image path (optional)"
                value={p.image ?? ''}
                onChange={(v) => update(i, 'image', v)}
                placeholder="/projects/example.png"
              />
            </div>
            <Field
              label="Description"
              value={p.description}
              onChange={(v) => update(i, 'description', v)}
              multiline
            />
          </div>
        ))
      )}
    </section>
  );
}

function ArticlesEditor({ active }: { active: boolean }) {
  const [items, setItems] = useState<Article[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const toast = useToast();
  useUnsavedWarning(dirty);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/articles');
      if (res.ok) {
        const data = await res.json();
        setItems(data.articles);
      } else {
        toast.show('Failed to load articles.', 'error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(i: number, field: keyof Article, value: string) {
    setItems((prev) =>
      prev ? prev.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)) : prev
    );
    setDirty(true);
  }

  function add() {
    setItems((prev) => [
      ...(prev ?? []),
      { id: '', title: '', description: '', cover_image: '', url: '' },
    ]);
    setDirty(true);
  }

  function remove(i: number) {
    setItems((prev) => (prev ? prev.filter((_, idx) => idx !== i) : prev));
    setDirty(true);
  }

  function reorder(from: number, to: number) {
    setItems((prev) => (prev ? move(prev, from, to) : prev));
    setDirty(true);
  }

  async function save() {
    if (!items) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: items }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setItems(data.articles);
        setDirty(false);
        toast.show(saveMessage(data.mode), 'ok');
      } else {
        toast.show(data.error || 'Save failed.', 'error');
      }
    } catch {
      toast.show('Network error.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ display: active ? 'block' : 'none' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Articles{dirty && <span className={styles.dirtyDot} title="Unsaved changes" />}
        </h2>
        <div className={styles.sectionActions}>
          <button className={styles.ghostButton} onClick={add} type="button">
            + Add article
          </button>
          <button
            className={styles.primaryButton}
            onClick={save}
            type="button"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save articles'}
          </button>
        </div>
      </div>
      <p className={styles.muted}>
        These featured articles appear before the ones pulled automatically from dev.to.
      </p>
      {items === null ? (
        <p className={styles.muted}>Loading…</p>
      ) : items.length === 0 ? (
        <p className={styles.muted}>
          No manual articles. Your dev.to posts still show on the site.
        </p>
      ) : (
        items.map((a, i) => (
          <div
            className={styles.card}
            key={i}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex.current !== null) reorder(dragIndex.current, i);
              dragIndex.current = null;
            }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <DragHandle index={i} dragIndex={dragIndex} />
                <span className={styles.cardTitle}>{a.title || 'Untitled article'}</span>
              </div>
              <RemoveButton onRemove={() => remove(i)} />
            </div>
            <div className={styles.grid2}>
              <Field label="Title" value={a.title} onChange={(v) => update(i, 'title', v)} />
              <Field
                label="URL"
                value={a.url}
                onChange={(v) => update(i, 'url', v)}
                placeholder="https://…"
              />
              <UploadField
                label="Cover image"
                value={a.cover_image}
                onChange={(v) => update(i, 'cover_image', v)}
                placeholder="https://… or /path.png"
              />
            </div>
            <Field
              label="Description"
              value={a.description}
              onChange={(v) => update(i, 'description', v)}
              multiline
            />
          </div>
        ))
      )}
    </section>
  );
}

function SettingsEditor({ active }: { active: boolean }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();
  useUnsavedWarning(dirty);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        const loaded: SiteSettings | null = data.settings;
        setSettings(
          loaded
            ? {
                ...loaded,
                identity: {
                  name: '',
                  aboutSubtitle: '',
                  cvUrl: '',
                  cvUrlEn: '',
                  cvUrlTr: '',
                  ...((loaded.identity ?? {}) as Partial<SiteSettings['identity']>),
                },
              }
            : emptySettings()
        );
      } else {
        toast.show('Failed to load settings.', 'error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateIdentity(
    field: 'name' | 'aboutSubtitle' | 'cvUrl' | 'cvUrlEn' | 'cvUrlTr',
    value: string
  ) {
    setSettings((prev) =>
      prev ? { ...prev, identity: { ...prev.identity, [field]: value } } : prev
    );
    setDirty(true);
  }

  function updateHome(locale: Locale, field: keyof HomeContent, value: string) {
    setSettings((prev) => {
      if (!prev) return prev;
      const locContent = prev.content[locale];
      return {
        ...prev,
        content: {
          ...prev.content,
          [locale]: { ...locContent, home: { ...locContent.home, [field]: value } },
        },
      };
    });
    setDirty(true);
  }

  function updateAbout(locale: Locale, field: keyof AboutContent, value: string) {
    setSettings((prev) => {
      if (!prev) return prev;
      const locContent = prev.content[locale];
      return {
        ...prev,
        content: {
          ...prev.content,
          [locale]: { ...locContent, about: { ...locContent.about, [field]: value } },
        },
      };
    });
    setDirty(true);
  }

  function updateSocial(i: number, field: 'social' | 'link' | 'href', value: string) {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            socials: prev.socials.map((s, idx) =>
              idx === i ? { ...s, [field]: value } : s
            ),
          }
        : prev
    );
    setDirty(true);
  }

  function addSocial() {
    setSettings((prev) =>
      prev
        ? { ...prev, socials: [...prev.socials, { social: '', link: '', href: '' }] }
        : prev
    );
    setDirty(true);
  }

  function removeSocial(i: number) {
    setSettings((prev) =>
      prev ? { ...prev, socials: prev.socials.filter((_, idx) => idx !== i) } : prev
    );
    setDirty(true);
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSettings(data.settings);
        setDirty(false);
        toast.show(saveMessage(data.mode), 'ok');
      } else {
        toast.show(data.error || 'Save failed.', 'error');
      }
    } catch {
      toast.show('Network error.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ display: active ? 'block' : 'none' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Site content{dirty && <span className={styles.dirtyDot} title="Unsaved changes" />}
        </h2>
        <div className={styles.sectionActions}>
          <button
            className={styles.primaryButton}
            onClick={save}
            type="button"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save content'}
          </button>
        </div>
      </div>
      {settings === null ? (
        <p className={styles.muted}>Loading…</p>
      ) : (
        <>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Identity</h3>
            <Field
              label="Name (shown on Home & About)"
              value={settings.identity.name}
              onChange={(v) => updateIdentity('name', v)}
            />
            <Field
              label="About subtitle"
              value={settings.identity.aboutSubtitle}
              onChange={(v) => updateIdentity('aboutSubtitle', v)}
            />
            <UploadField
              label="Resume / CV — English (PDF)"
              value={settings.identity.cvUrlEn ?? ''}
              onChange={(v) => updateIdentity('cvUrlEn', v)}
              accept="application/pdf"
              preview="link"
              placeholder="/CV_EN.pdf"
            />
            <UploadField
              label="Resume / CV — Turkish (PDF)"
              value={settings.identity.cvUrlTr ?? ''}
              onChange={(v) => updateIdentity('cvUrlTr', v)}
              accept="application/pdf"
              preview="link"
              placeholder="/CV_TR.pdf"
            />
          </div>
          {LOCALES.map(({ code, label }) => (
            <div className={styles.card} key={code}>
              <h3 className={styles.cardTitle}>{label}</h3>
              <Field
                label="Home — role"
                value={settings.content[code].home.role}
                onChange={(v) => updateHome(code, 'role', v)}
              />
              <Field
                label="Home — bio"
                value={settings.content[code].home.bio}
                onChange={(v) => updateHome(code, 'bio', v)}
                multiline
              />
              {ABOUT_FIELDS.map(({ key, label: fieldLabel, multiline }) => (
                <Field
                  key={key}
                  label={`About — ${fieldLabel}`}
                  value={settings.content[code].about[key]}
                  onChange={(v) => updateAbout(code, key, v)}
                  multiline={multiline}
                />
              ))}
            </div>
          ))}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Social / contact links</h3>
              <button className={styles.ghostButton} onClick={addSocial} type="button">
                + Add link
              </button>
            </div>
            {settings.socials.length === 0 ? (
              <p className={styles.muted}>No links yet.</p>
            ) : (
              settings.socials.map((s, i) => (
                <div className={styles.grid3} key={i}>
                  <Field
                    label="Label"
                    value={s.social}
                    onChange={(v) => updateSocial(i, 'social', v)}
                    placeholder="github"
                  />
                  <Field
                    label="Display text"
                    value={s.link}
                    onChange={(v) => updateSocial(i, 'link', v)}
                  />
                  <div className={styles.rowWithButton}>
                    <Field
                      label="URL"
                      value={s.href}
                      onChange={(v) => updateSocial(i, 'href', v)}
                    />
                    <RemoveButton onRemove={() => removeSocial(i)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}

const TABS: { id: 'projects' | 'articles' | 'settings'; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'articles', label: 'Articles' },
  { id: 'settings', label: 'Site content' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<'projects' | 'articles' | 'settings'>('projects');

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.topbar}>
        <div className={styles.brand}>Portfolio Admin</div>
        <nav className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button className={styles.ghostButton} onClick={logout} type="button">
          Logout
        </button>
      </header>
      <ToastProvider>
        <main className={styles.main}>
          <ProjectsEditor active={tab === 'projects'} />
          <ArticlesEditor active={tab === 'articles'} />
          <SettingsEditor active={tab === 'settings'} />
        </main>
      </ToastProvider>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (!isAuthed(ctx.req)) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
