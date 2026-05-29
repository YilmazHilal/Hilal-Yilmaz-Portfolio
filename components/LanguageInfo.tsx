import { VscGlobe, VscCheck } from 'react-icons/vsc';

import styles from '@/styles/LanguageInfo.module.css';
import { useLanguage } from '@/context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
] as const;

const LanguageInfo = () => {
  const { language, setLanguage, ui } = useLanguage();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <VscGlobe size={18} />
        </span>
        <p className={styles.hint}>{ui.settings.languageHint}</p>
      </div>

      <div className={styles.options} role="group" aria-label="Language">
        {LANGUAGES.map((lang) => {
          const active = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              className={`${styles.option} ${active ? styles.active : ''}`}
              aria-pressed={active}
              onClick={() => setLanguage(lang.code)}
            >
              <span className={styles.badge}>{lang.short}</span>
              <span className={styles.label}>{lang.label}</span>
              {active && <VscCheck className={styles.check} size={16} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageInfo;
