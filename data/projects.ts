export interface Project {
  title: string;
  description: string;
  logo: string;
  image?: string; // Optional project cover image
  link: string;
  slug: string;
}

export const projects: Project[] = [
  {
    title: 'VSCode Portfolio',
    description:
      'A Visual Studio Code themed developer portfolio built with Next.js and CSS Modules.',
    logo: '/logos/vsc.svg',
    image: '/projects/vscode-portfolio.png',
    link: 'https://github.com/GunduzTolga/vscode-portfolio',
    slug: 'vscode-portfolio',
  },
];
