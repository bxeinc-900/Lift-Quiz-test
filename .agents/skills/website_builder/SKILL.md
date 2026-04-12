---
name: website_builder
description: Skill for building and deploying static website templates with Vite, Cloudflare Pages, and GitHub.
---

# Website Builder Workflow

This skill streamlines the process of creating, previewing, and deploying high-quality static landing pages and websites.

## Core Principles
1. **GitHub First**: Always maintain a clean git history. Each template or site should be its own repo or a branch.
2. **Static by Default**: Leverage Vite's lightning-fast static builds.
3. **Cloudflare Deployment**: Seamlessly deploy to Cloudflare Pages via GitHub integration.

## 1. Development Process

- **Start Dev Server**: Run `npm run dev` to see your site locally.
- **Preview Build**: Before pushing, run `npm run build` and then `npm run preview` to ensure the static assets are correctly generated.

## 2. Deployment to GitHub

To push your changes to GitHub:

1. **Initialize Git** (if not already):
   ```bash
   git init
   git add .
   git commit -m "initial: landing page foundation"
   ```
2. **Add Remote**:
   ```bash
   git remote add origin <your-github-repo-url>
   ```
3. **Push**:
   ```bash
   git push -u origin main
   ```

## 3. Cloudflare Pages Setup

1. **Connect GitHub**: In the Cloudflare Dashboard, go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. **Select Repo**: Choose the repository you pushed your site to.
3. **Build Settings**:
   - **Framework Preset**: `Vite` (or select "None" and specify the following):
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
4. **Environment Variables**: Add any necessary secrets (like API keys) in the Cloudflare Dashboard.
5. **Auto-Deploy**: Once set up, every push to `main` will automatically trigger a new deployment to Cloudflare.

## 4. Design Guidelines

Follow the principles in the system's `web_application_development` instructions:
- **Vibrant Aesthetics**: Use smooth gradients, glassmorphism, and HSL colors.
- **Premium Typography**: Use Google Fonts like 'Inter' or 'Outfit'.
- **Interactive**: Add hover states and entry animations for elements.
- **SEO Ready**: Always include proper meta tags in `index.html`.

## 5. Deployment Checklist
- [ ] Responsive design (mobile/tablet/desktop).
- [ ] Optimized images (use modern formats like WebP).
- [ ] Meta title and description are set.
- [ ] `favicon.ico` is present.
- [ ] Built assets are verified using `npm run preview`.
