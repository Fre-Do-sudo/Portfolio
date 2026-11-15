# Godfrey's portfolio

## Deployment

This Vite app is configured for Vercel. Connect this GitHub repository to a Vercel
project, use `main` as the production branch, and set the project name to
`godfrey-portfolio` for a memorable `godfrey-portfolio.vercel.app` address if that
slug is available. The project builds with `npm run build` and publishes `dist`.

The GitHub Actions build workflow checks pushes to `main` and pull requests.
Vercel's Git integration is responsible for preview and production deployments.
