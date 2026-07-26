import ContactCode from '@/components/ContactCode';
import { useLanguage } from '@/context/LanguageContext';

import styles from '@/styles/ContactPage.module.css';

const ContactPage = () => {
  const { ui } = useLanguage();

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>{ui.contact.title}</h1>
      <p className={styles.pageSubtitle}>{ui.contact.intro}</p>
      <div className={styles.container}>
        <div className={styles.contactContainer}>
          <ContactCode />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Contact' },
    // Without this Next.js emits s-maxage=1y and the CDN keeps serving the
    // pre-deploy page, so admin edits stay invisible until it is purged.
    revalidate: 60,
  };
}

export default ContactPage;
