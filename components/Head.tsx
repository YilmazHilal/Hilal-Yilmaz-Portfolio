import Head from 'next/head';

import settings from '@/data/settings.json';

interface CustomHeadProps {
  title: string;
}

const SITE_URL = 'https://hilalyilmaz.net';

/**
 * og:image must be an absolute URL — WhatsApp, LinkedIn and X ignore relative
 * paths, so an uploaded "/uploads/photo.png" needs the host prefixed.
 */
function absoluteUrl(path: string): string {
  if (/^https?:/i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

const CustomHead = ({ title }: CustomHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Hilal Yılmaz is an Industrial Engineer from Türkiye, focused on process optimization, supply chain management and data-driven solutions that improve efficiency."
      />
      <meta
        name="keywords"
        content="hilal yılmaz, industrial engineer, endüstri mühendisi, process optimization, supply chain, operations research, data analytics, portfolio, nextjs"
      />
      <meta property="og:title" content="Hilal Yılmaz's Portfolio" />
      <meta
        property="og:description"
        content="Industrial Engineer focused on process optimization, efficiency and data-driven solutions."
      />
      <meta
        property="og:image"
        content={absoluteUrl(settings.identity.profileImage || '/profile.png')}
      />
      <meta property="og:url" content={SITE_URL} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Hilal Yılmaz',
};
