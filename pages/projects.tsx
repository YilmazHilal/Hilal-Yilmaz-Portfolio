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
    // Without this Next.js emits s-maxage=1y and the CDN keeps serving the
    // pre-deploy page, so admin edits stay invisible until it is purged.
    revalidate: 60,
  };
}

export default ProjectsPage;
