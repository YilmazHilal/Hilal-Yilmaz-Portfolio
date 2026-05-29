import Tab from '@/components/Tab';

import styles from '@/styles/Tabsbar.module.css';
import settings from '@/data/settings.json';

const Tabsbar = () => {
  return (
    <div className={styles.tabs}>
      <Tab icon="/logos/react_icon.svg" filename="home.tsx" path="/" />
      <Tab icon="/logos/html_icon.svg" filename="about.html" path="/about" />
      <Tab icon="/logos/css_icon.svg" filename="contact.css" path="/contact" />
      <Tab icon="/logos/js_icon.svg" filename="projects.js" path="/projects" />
      <Tab
        icon="/logos/json_icon.svg"
        filename="articles.json"
        path="/articles"
      />
      <Tab
        icon="/logos/markdown_icon.svg"
        filename="github.md"
        path="/github"
      />
      <Tab
        icon="/logos/adobe.svg"
        filename="CV.pdf"
        path={settings.identity.cvUrl || '/CV.pdf'}
        isExternal={true}
      />
    </div>
  );
};

export default Tabsbar;
