import { defineConfig } from 'vite';

// GitHub Pages project sites require the repository name as their base path.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
export default defineConfig({ base: process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/' });
