import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/context/LanguageContext';

import { Article } from '@/types';
import manualArticles from '@/data/articles.json';

import styles from '@/styles/ArticlesPage.module.css';

interface ArticlesPageProps {
  articles: Article[];
}

const ArticlesPage = ({ articles }: ArticlesPageProps) => {
  const { ui } = useLanguage();

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>{ui.articles.title}</h1>
      <p className={styles.pageSubtitle}>
        {ui.articles.introPrefix}{' '}
        <a
          href="https://dev.to/yilmazhilal"
          target="_blank"
          rel="noopener"
          className={styles.underline}
        >
          {ui.articles.link}
        </a>{' '}
        {ui.articles.introSuffix}
      </p>
      <div className={styles.container}>
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p>{ui.articles.empty}</p>
        )}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  let devArticles: Article[] = [];

  try {
    const res = await fetch(
      'https://dev.to/api/articles/me/published?per_page=6',
      {
        headers: {
          'api-key': process.env.DEV_TO_API_KEY || '',
        },
      }
    );

    if (res.ok) {
      devArticles = await res.json();
    } else {
      throw new Error('Failed to fetch articles');
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  const articles: Article[] = [
    ...(manualArticles as Article[]),
    ...devArticles,
  ];

  return {
    props: { title: 'Articles', articles },
    revalidate: 60,
  };
}

export default ArticlesPage;
