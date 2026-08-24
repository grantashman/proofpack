import { defineConfig } from 'astro/config';

const isGitHubPages = process.env.GITHUB_PAGES === '1';

export default defineConfig({
  output: 'static',
  site: isGitHubPages ? 'https://grantashman.github.io' : undefined,
  base: isGitHubPages ? '/proofpack' : '/',
  devToolbar: {
    enabled: false,
  },
  build: {
    format: 'directory'
  }
});
