# LIFT Quiz Funnel — Cloudflare Pages Deployment

## Cloudflare Pages Build Settings

When connecting this repository to Cloudflare Pages, use these settings:

| Setting | Value |
|---|---|
| **Framework preset** | None (or Vite) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave blank) |
| **Node.js version** | 18 (or higher) |

## SPA Routing

The `public/_redirects` file handles client-side routing:
```
/* /index.html 200
```

This is automatically copied into `dist/` on every build.

## Environment Variables

No environment variables required — all configuration is in the source code.

## Custom Domain

1. In Cloudflare Pages → Settings → Custom Domains
2. Add your domain (e.g., `lift.wealthvids.com`)
3. DNS is managed automatically if domain is on Cloudflare

## Repository

GitHub: `https://github.com/bxeinc-900/Lift-Quiz-test`  
Branch: `main`
