import Image from 'next/image';
import styles from '@/styles/AboutPage.module.css';
import { useLanguage } from '@/context/LanguageContext';
import settings from '@/data/settings.json';

const AboutPage = () => {
  const { t } = useLanguage();
  const { name, aboutSubtitle } = settings.identity;
  const profileImage = settings.identity.profileImage || '/profile.png';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.profileImageContainer}>
          <Image
            src={profileImage}
            className={styles.profileImage}
            alt={name}
            width={250}
            height={250}
            priority
          />
        </div>
        <h1 className={styles.title}>{name}</h1>
        <div className={styles.subtitle}>{aboutSubtitle}</div>

        <div className={styles.aboutContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.about.profile_title}</h2>
            <p
              className={styles.paragraph}
              dangerouslySetInnerHTML={{ __html: t.about.profile_text }}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.about.experience_title}</h2>
            <p
              className={styles.paragraph}
              dangerouslySetInnerHTML={{ __html: t.about.experience_text }}
            />
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.about.philosophy_title}</h2>
            <p className={styles.paragraph}>
              {t.about.philosophy_text}
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.about.beyond_title}</h2>
            <p className={styles.paragraph}>
              {t.about.beyond_text}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'About' },
  };
}

export default AboutPage;
