import ContactCode from '@/components/ContactCode';

import styles from '@/styles/ContactPage.module.css';

const ContactPage = () => {
  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>Contact Me</h1>
      <p className={styles.pageSubtitle}>
        I&apos;m always happy to connect with people who share a passion for technology, design, and innovation. Whether you&apos;d like to collaborate on a project, discuss new ideas, or simply chat about web development and AI, feel free to reach out. Building meaningful connections has always been a core part of my journey, and I look forward to hearing from you.
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
