# vscode-portfolio
[![Open is Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/YilmazHilal/Hilal-Yilmaz-Portfolio.git)

A Visual Studio Code themed developer portfolio website built with Next.js and deployed on Vercel.

![vscode-portfolio banner](https://imgur.com/PZVrvgN)

## Features Roadmap

- [ ] Themes and customizations
  - [x] GitHub Dark (default)
  - [ ] One Dark Pro
  - [x] Dracula
  - [x] Ayu
  - [x] Nord
- [ ] Interactive custom terminal

For other features and themes suggestions, please open an issue.

## Environment Variables

Create an `.env.local` file inside the project directory (see `.env.local.example`).

- `DEV_TO_API_KEY` — fetch your published articles from dev.to (optional).
- `ADMIN_PASSWORD` — password for the admin panel at `/admin` (required to use it).
- `ADMIN_SESSION_SECRET` — optional secret for signing admin sessions (falls back to `ADMIN_PASSWORD`).
- `GITHUB_TOKEN` — optional fine-grained PAT (`Contents: Read and write`) so the admin panel commits content changes back to the repo and triggers a redeploy. Without it, edits are written to local files (dev only).

## Admin Panel

Visit `/admin` and sign in with `ADMIN_PASSWORD` to manage:

- **Projects** — the cards on the Projects page (`data/projects.json`).
- **Articles** — featured articles shown before your dev.to posts (`data/articles.json`).
- **Site content** — name, About subtitle, resume/CV, bilingual Home/About text and contact links (`data/settings.json`).

Logos, cover images and the CV (PDF) can be uploaded directly in the panel; files are committed under `public/uploads/` (max ~4MB per file). Image paths can also be set manually to a `public/` path or a domain configured in `next.config.ts` (`images.remotePatterns`).

When `GITHUB_TOKEN` is set, saving commits the relevant file to the repository; Vercel then redeploys automatically.

## Running Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

All VSCode related components can be found in the `components` folder. To change the content of the portfolio, check out the `pages` folder. To add or remove pages, modify `components/Sidebar.jsx` and `components/Tabsbar.jsx`.

## Next.js Resources

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
