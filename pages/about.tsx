import Image from 'next/image';
import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.profileImageContainer}>
                    <Image
            src="/profile.png"
            className={styles.profileImage}
            alt="Hilal Yılmaz"
            width={250}
            height={250}
            priority
          />
        </div>
        <h1 className={styles.title}>Hilal Yılmaz</h1>
        <div className={styles.subtitle}>Industrial Engineer</div>

        <div className={styles.aboutContent}>
          <section className={styles.section}>
            <p className={styles.paragraph}>
              Hey! I&apos;m Hilal Yılmaz, an Industrial Engineer from Türkiye. With a passion for optimizing processes and improving efficiency, I focus on creating data-driven solutions that make operations smoother and more productive.
            </p>
            <p className={styles.paragraph}>
              My expertise lies in process optimization, supply chain management, and production planning. I enjoy analyzing complex systems and finding innovative ways to enhance workflow efficiency and reduce waste.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <p className={styles.paragraph}>
              Throughout my academic journey and internships, I&apos;ve worked on various projects involving production optimization, quality management, and lean manufacturing principles. I&apos;m passionate about continuous improvement and applying engineering methodologies to solve real-world problems.
            </p>
            <p className={styles.paragraph}>
              I thrive in collaborative environments where analytical thinking meets practical problem-solving. My goal is to contribute to sustainable and efficient industrial operations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills &amp; Focus Areas</h2>
            <p className={styles.paragraph}>
              I specialize in process analysis, operations research, and data analytics. My approach combines engineering principles with modern tools to deliver measurable improvements in productivity and quality.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Beyond Engineering</h2>
            <p className={styles.paragraph}>
              When I&apos;m not working on optimization projects, I enjoy exploring new technologies, reading about industry trends, and spending time in nature. I believe in balancing technical expertise with creativity and continuous learning.
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
