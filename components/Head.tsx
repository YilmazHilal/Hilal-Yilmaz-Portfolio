import Head from 'next/head';

interface CustomHeadProps {
  title: string;
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
      <meta property="og:image" content="https://hilalyilmaz.net/profile.png" />
      <meta property="og:url" content="https://hilalyilmaz.net" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Hilal Yılmaz',
};
