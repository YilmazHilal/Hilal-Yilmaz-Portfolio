import { VscGlobe } from 'react-icons/vsc';
import styles from '@/styles/ThemeInfo.module.css';
import { useLanguage } from '@/context/LanguageContext';

const LanguageInfo = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <VscGlobe size={60} color="var(--accent-color)" />
            </div>
            <div className={styles.info}>
                <div>
                    <h3>Language / Dil</h3>
                    <h5>Select your preferred language</h5>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                        onClick={() => setLanguage('en')}
                        style={{
                            opacity: language === 'en' ? 1 : 0.5,
                            border: language === 'en' ? '1px solid var(--accent-color)' : 'none'
                        }}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('tr')}
                        style={{
                            opacity: language === 'tr' ? 1 : 0.5,
                            border: language === 'tr' ? '1px solid var(--accent-color)' : 'none'
                        }}
                    >
                        Türkçe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageInfo;
