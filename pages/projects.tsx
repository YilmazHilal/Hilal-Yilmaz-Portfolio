import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';

import styles from '@/styles/ProjectsPage.module.css';

const ProjectsPage = () => {
  const { ui } = useLanguage();

  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>{ui.projects.title}</h1>
      <p className={styles.pageSubtitle}>{ui.projects.subtitle}</p>

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
