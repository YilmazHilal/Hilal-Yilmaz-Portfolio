import { useEffect } from 'react';
import type { AppProps } from 'next/app';

import Layout from '@/components/Layout';
import Head from '@/components/Head';

import { LanguageProvider } from '@/context/LanguageContext';

import '@/styles/globals.css';
import '@/styles/themes.css';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  return (
    <LanguageProvider>
      <Layout>
        <Head title={`Hilal Yılmaz | ${pageProps.title}`} />
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  );
}

export default MyApp;
