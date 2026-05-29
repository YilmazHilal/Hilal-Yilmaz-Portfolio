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
  };
}

export default ContactPage;
