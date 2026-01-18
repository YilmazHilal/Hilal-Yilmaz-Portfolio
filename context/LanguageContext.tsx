import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import en from '../translations/en';
import tr from '../translations/tr';

type Language = 'en' | 'tr';

interface TranslationStrings {
    home: {
        role: string;
        bio: string;
    };
    about: {
        title: string;
        subtitle: string;
        profile_title: string;
        profile_text: string;
        experience_title: string;
        experience_text: string;
        skills_title: string;
        skills_text: string;
        beyond_title: string;
        beyond_text: string;
    };
    contact: {
        title: string;
        subtitle: string;
    };
    projects: {
        title: string;
        subtitle: string;
    };
}

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationStrings;
}

const translations: Record<Language, TranslationStrings> = { en, tr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const saved = localStorage.getItem('language') as Language;
        if (saved === 'en' || saved === 'tr') {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
