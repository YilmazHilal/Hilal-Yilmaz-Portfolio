import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import settings from '@/data/settings.json';
import { ui as uiStrings, type UiStrings } from '@/translations/ui';
import type { LocaleContent } from '@/types';

type Language = 'en' | 'tr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: LocaleContent;
    ui: UiStrings;
}

const translations = settings.content as Record<Language, LocaleContent>;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const saved = localStorage.getItem('language');
        if (saved === 'en' || saved === 'tr') {
            setLanguageState(saved);
        } else if (
            typeof navigator !== 'undefined' &&
            navigator.language?.toLowerCase().startsWith('tr')
        ) {
            setLanguageState('tr');
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t: translations[language],
                ui: uiStrings[language],
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
