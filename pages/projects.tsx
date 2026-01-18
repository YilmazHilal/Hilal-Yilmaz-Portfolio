import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import styles from '@/styles/ProjectsPage.module.css';
import { useLanguage } from '@/context/LanguageContext';

const ProjectsPage = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>{t.projects.title}</h1>
      <p className={styles.pageSubtitle}>
        {t.projects.subtitle}
      </p>

      <div className={styles.container}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Projects' },
  };
}

export default ProjectsPage;
