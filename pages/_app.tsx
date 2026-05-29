import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import Layout from '@/components/Layout';
import Head from '@/components/Head';
import { LanguageProvider } from '@/context/LanguageContext';
import settings from '@/data/settings.json';

import '@/styles/globals.css';
import '@/styles/themes.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  if (isAdmin) {
    return (
      <>
        <Head title={`Admin | ${settings.identity.name}`} />
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <LanguageProvider>
      <Layout>
        <Head title={`${settings.identity.name} | ${pageProps.title}`} />
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  );
}

export default MyApp;
