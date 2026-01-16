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
        content="Hilal Yılmaz is an avid full stack web developer building websites and applications you'd love to use"
      />
      <meta
        name="keywords"
        content="hilal yilmaz, hilal yılmaz, web developer portfolio, hilal web developer, hilal developer, mern stack, Hilal Yılmaz portfolio, vscode-portfolio, solelunatech"
      />
      <meta property="og:title" content="Hilal Yılmaz's Portfolio" />
      <meta
        property="og:description"
        content="A full-stack developer building websites that you'd like to use."
      />
      <meta property="og:image" content="https://imgur.com/4zi5KkQ.png" />
      <meta property="og:url" content="https://vscode-portfolio.vercel.app" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Hilal Yılmaz',
};
