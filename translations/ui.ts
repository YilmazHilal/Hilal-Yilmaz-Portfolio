// Static UI strings (app chrome). Editable page content lives in data/settings.json.

export interface UiStrings {
  home: {
    contact: string;
    viewProjects: string;
    downloadCv: string;
  };
  projects: {
    title: string;
    subtitle: string;
  };
  articles: {
    title: string;
    introPrefix: string;
    link: string;
    introSuffix: string;
    empty: string;
  };
  contact: {
    title: string;
    intro: string;
  };
  settings: {
    language: string;
    themes: string;
    languageHint: string;
  };
}

const en: UiStrings = {
  home: {
    contact: 'Contact Me',
    viewProjects: 'View Projects',
    downloadCv: 'Download CV',
  },
  projects: {
    title: 'My Projects',
    subtitle:
      "Here's a collection of my recent work. These projects showcase my skills in web development, design, and problem-solving.",
  },
  articles: {
    title: 'My Articles',
    introPrefix: 'Recent posts from',
    link: 'dev.to',
    introSuffix: '— where I share ideas and tutorials about web development.',
    empty: 'No articles available.',
  },
  contact: {
    title: 'Contact Me',
    intro:
      "I'm always happy to connect with people who share a passion for technology, design, and innovation. Whether you'd like to collaborate on a project, discuss new ideas, or simply chat about web development and AI, feel free to reach out. Building meaningful connections has always been a core part of my journey, and I look forward to hearing from you.",
  },
  settings: {
    language: 'Language / Dil',
    themes: 'Themes',
    languageHint: 'Choose your language — it applies across the site instantly.',
  },
};

const tr: UiStrings = {
  home: {
    contact: 'Bana Ulaşın',
    viewProjects: 'Projeleri Gör',
    downloadCv: 'CV İndir',
  },
  projects: {
    title: 'Projelerim',
    subtitle:
      'Son çalışmalarımdan bir seçki. Bu projeler web geliştirme, tasarım ve problem çözme becerilerimi sergiliyor.',
  },
  articles: {
    title: 'Makalelerim',
    introPrefix: 'Son yazılar:',
    link: 'dev.to',
    introSuffix: '— web geliştirme üzerine fikir ve eğitim paylaştığım yer.',
    empty: 'Henüz makale yok.',
  },
  contact: {
    title: 'Bana Ulaşın',
    intro:
      'Teknoloji, tasarım ve inovasyon tutkusunu paylaşan insanlarla tanışmaktan her zaman mutluluk duyarım. İster bir projede iş birliği yapmak, ister yeni fikirler tartışmak, ister sadece web geliştirme ve yapay zeka üzerine sohbet etmek isteyin, çekinmeden bana ulaşın. Anlamlı bağlantılar kurmak yolculuğumun her zaman önemli bir parçası oldu ve sizden haber almayı dört gözle bekliyorum.',
  },
  settings: {
    language: 'Language / Dil',
    themes: 'Temalar',
    languageHint: 'Dilini seç — site genelinde anında uygulanır.',
  },
};

export const ui: Record<'en' | 'tr', UiStrings> = { en, tr };
