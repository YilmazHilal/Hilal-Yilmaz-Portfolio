export interface Article {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  url: string;
  page_views_count?: number;
  public_reactions_count?: number;
  comments_count?: number;
}

export interface Project {
  title: string;
  description: string;
  logo: string;
  image?: string; // Optional project cover image
  link: string;
  slug: string;
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  watchers: number;
  forks: number;
  stargazers_count: number;
  html_url: string;
  homepage: string;
}

export interface User {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}

export interface HomeContent {
  role: string;
  bio: string;
}

export interface AboutContent {
  profile_title: string;
  profile_text: string;
  experience_title: string;
  experience_text: string;
  philosophy_title: string;
  philosophy_text: string;
  beyond_title: string;
  beyond_text: string;
}

export interface LocaleContent {
  home: HomeContent;
  about: AboutContent;
}

export interface SocialLink {
  social: string;
  link: string;
  href: string;
}

export interface Identity {
  name: string;
  aboutSubtitle: string;
  profileImage?: string; // Optional profile photo; falls back to /profile.png
  cvUrl: string;
  cvUrlEn?: string;
  cvUrlTr?: string;
}

export interface SiteSettings {
  identity: Identity;
  content: {
    en: LocaleContent;
    tr: LocaleContent;
  };
  socials: SocialLink[];
}
