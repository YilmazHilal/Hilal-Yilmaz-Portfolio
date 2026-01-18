import ContactCode from '@/components/ContactCode';
import styles from '@/styles/ContactPage.module.css';
import { useLanguage } from '@/context/LanguageContext';

const ContactPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>{t.contact.title}</h1>
      <p className={styles.pageSubtitle}>
        {t.contact.subtitle}
      </p>
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
  };
}

export default ContactPage;
