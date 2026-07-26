import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VscArrowRight, VscMail } from 'react-icons/vsc';
import { FaLinkedin } from 'react-icons/fa';

import styles from '@/styles/HomePage.module.css';
import { useLanguage } from '@/context/LanguageContext';
import settings from '@/data/settings.json';

const [firstName, ...restNameParts] = settings.identity.name.split(' ');
const restName = restNameParts.join(' ');
const linkedinHref = settings.socials.find((s) => s.social === 'linkedin')?.href;

export default function HomePage() {
  const { t, ui } = useLanguage();
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const codeLines = [
    { code: 'const HomePage = () => {', type: 'function' },
    {
      code: '  const [isLoaded, setIsLoaded] = useState(true);',
      type: 'variable',
    },
    { code: '  const developerInfo = {', type: 'variable' },
    { code: "    name: 'Hilal Yılmaz',", type: 'array-item' },
    { code: "    role: 'Co-Founder - Industrial Engineer',", type: 'array-item' },
    { code: "    bio: 'Building modern web experiences'", type: 'array-item' },
    { code: '  };', type: 'array-end' },
    { code: '', type: 'blank' },
    { code: '  useEffect(() => {', type: 'nested-function' },
    {
      code: '    document.title = `${developerInfo.name} | Portfolio`;',
      type: 'return',
    },
    { code: '    setIsLoaded(true);', type: 'function-call' },
    { code: '  }, []);', type: 'close' },
    { code: '', type: 'blank' },
    { code: '  return (', type: 'return-object' },
    { code: '    <main className="hero-container">', type: 'object-method' },
    { code: '      <h1>{developerInfo.name}</h1>', type: 'object-method' },
    { code: '      <p>{developerInfo.role}</p>', type: 'object-method' },
    { code: '      <div className="cta">', type: 'object-method' },
    {
      code: '        <Link href="/projects">View Projects</Link>',
      type: 'object-method',
    },
    { code: '      </div>', type: 'object-method' },
    { code: '    </main>', type: 'object-method' },
    { code: '  );', type: 'close' },
    { code: '};', type: 'close-function' },
    { code: '', type: 'blank' },
    { code: 'export default HomePage;', type: 'function-call' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLineIndex((prev) => (prev + 1) % codeLines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [codeLines.length]);

  return (
    <div className={styles.heroLayout}>
      <div className={styles.container}>
        <div className={styles.codeSection}>
          <div className={styles.codeContainer}>
            <div className={styles.editorContent}>
              <div className={styles.lineNumbers}>
                {codeLines.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.lineNumber} ${index === activeLineIndex ? styles.activeLine : ''
                      }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              <div className={styles.codeEditor}>
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className={`${styles.codeLine} ${styles[line.type]} ${index === activeLineIndex ? styles.highlightedLine : ''
                      }`}
                  >
                    {line.code}
                  </div>
                ))}
              </div>

              <div className={styles.overlayGlow}></div>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.developerName}>
            {firstName} <span className={styles.accentText}>{restName}</span>
          </h1>

          <div className={styles.developerRole}>{t.home.role}</div>

          <p className={styles.bio}>
            {t.home.bio}
          </p>

          <div className={styles.actionLinks}>
            <div className={styles.buttonRow}>
              <Link href="/contact" className={styles.contactButton}>
                <VscMail /> {ui.home.contact}
              </Link>

              {linkedinHref && (
                <a
                  href={linkedinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedinButton}
                >
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>

            <div className={styles.buttonRow}>
              <Link href="/projects" className={styles.projectsButton}>
                <VscArrowRight /> {ui.home.viewProjects}
              </Link>
            </div>

            <div className={styles.buttonRow}>
              {settings.identity.cvUrlTr && (
                <a
                  href={settings.identity.cvUrlTr}
                  className={styles.cvButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  TR CV <span className={styles.arrowIcon}>→</span>
                </a>
              )}
              {settings.identity.cvUrlEn && (
                <a
                  href={settings.identity.cvUrlEn}
                  className={styles.cvButton}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  EN CV <span className={styles.arrowIcon}>→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.decorElements}>
        <div className={styles.codeFlare}></div>
        <div className={styles.gridLines}></div>
        <div className={styles.codeBlock1}>{'{'}</div>
        <div className={styles.codeBlock2}>{'}'}</div>
        <div className={styles.codeBlock3}>{'<>'}</div>
        <div className={styles.codeBlock4}>{'/>'}</div>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
        <div className={styles.codeSymbol1}>{'()'}</div>
        <div className={styles.codeSymbol2}>{'[]'}</div>
        <div className={styles.codeSymbol3}>{'=>'}</div>
        <div className={styles.dotPattern}></div>
        <div className={styles.mobileAccent}></div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Home' },
    // Without this Next.js emits s-maxage=1y and the CDN keeps serving the
    // pre-deploy page, so admin edits stay invisible until it is purged.
    revalidate: 60,
  };
}
