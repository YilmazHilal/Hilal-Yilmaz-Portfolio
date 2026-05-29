import { useState } from 'react';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next';

import { isAuthed } from '@/lib/auth';
import styles from '@/styles/Admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace('/admin');
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Login failed');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authLayout}>
      <form className={styles.authCard} onSubmit={onSubmit}>
        <h1 className={styles.authTitle}>Portfolio Admin</h1>
        <p className={styles.authSubtitle}>
          Enter your password to manage projects, articles and site content.
        </p>
        <input
          type="password"
          className={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={loading || !password}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (isAuthed(ctx.req)) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
}
