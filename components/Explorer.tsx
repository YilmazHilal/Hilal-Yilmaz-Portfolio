import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { VscChevronRight } from 'react-icons/vsc';

import styles from '@/styles/Explorer.module.css';
import settings from '@/data/settings.json';

const explorerItems = [
  {
    name: 'home.tsx',
    path: '/',
    icon: '/logos/react_icon.svg',
  },
  {
    name: 'about.html',
    path: '/about',
    icon: '/logos/html_icon.svg',
  },
  {
    name: 'contact.css',
    path: '/contact',
    icon: '/logos/css_icon.svg',
  },
  {
    name: 'projects.js',
    path: '/projects',
    icon: '/logos/js_icon.svg',
  },
  {
    name: 'articles.json',
    path: '/articles',
    icon: '/logos/json_icon.svg',
  },
  {
    name: 'github.md',
    path: '/github',
    icon: '/logos/markdown_icon.svg',
  },
  {
    name: 'CV.pdf',
    path: settings.identity.cvUrl || '/CV.pdf',
    icon: '/logos/adobe.svg',
    isExternal: true,
  },
];

const Explorer = () => {
  const [portfolioOpen, setPortfolioOpen] = useState(true);

  return (
    <div className={styles.explorer}>
      <p className={styles.title}>Explorer</p>
      <div>
        <input
          type="checkbox"
          className={styles.checkbox}
          id="portfolio-checkbox"
          checked={portfolioOpen}
          onChange={() => setPortfolioOpen(!portfolioOpen)}
        />
        <label htmlFor="portfolio-checkbox" className={styles.heading}>
          <VscChevronRight
            className={styles.chevron}
            style={portfolioOpen ? { transform: 'rotate(90deg)' } : {}}
          />
          Portfolio
        </label>
        <div
          className={styles.files}
          style={portfolioOpen ? { display: 'block' } : { display: 'none' }}
        >
          {explorerItems.map((item) => (
            item.isExternal ? (
              <a href={item.path} key={item.name} target="_blank" rel="noopener noreferrer">
                <div className={styles.file}>
                  <Image src={item.icon} alt={item.name} height={18} width={18} />{' '}
                  <p>{item.name}</p>
                </div>
              </a>
            ) : (
              <Link href={item.path} key={item.name}>
                <div className={styles.file}>
                  <Image src={item.icon} alt={item.name} height={18} width={18} />{' '}
                  <p>{item.name}</p>
                </div>
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explorer;
