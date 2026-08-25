import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact(),
  ],
  // GitHub Pages serves project sites from a /<repo-name>/ subpath, so every
  // asset URL Vite emits needs that prefix to resolve correctly.
  // If you move this to a custom domain (or a user/org root page, <username>.github.io),
  // change this back to '/' since the site would then be served from the domain root.
  base: '/blessing-itay-agam-krispin/',
})

export default config
