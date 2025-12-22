import { getDirectory } from ".";

const { dirName } = getDirectory();

export const gitignore = `# Dependencies
node_modules/

# Build outputs
dist/
build/
.output/
.nuxt/
.nitro/
.cache/
.next/

# Environment variables
.env
.env.*
!.env.example

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
.fleet/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Misc
*.tsbuildinfo`

export const readmeCode = `# ${dirName}
This is an empty project.`

export const nextPageCode = `export default function Page() {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  )
}`

export const globalsCss = `@import "tailwindcss";

:root {
    --background: #ffffff;
    --foreground: #171717;
}

body {
    background: var(--background);
    color: var(--foreground);
}`

export const nodeIndex = `import "dotenv/config"

console.log("Hello World!");`

export const nodePackage = `{
  "name": "${dirName}",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx index.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "@types/node": "^25.0.3",
    "dotenv": "^17.2.3",
    "tsx": "^4.21.0"
  }
}`

export const nuxtApp = `<script setup lang="ts">
  // Typescript logic.
  // Use "lucide-vue-next" for icons.
  // And "<NuxtImg />" for images.
</script>

<template>
  <div class="h-dvh flex justify-center items-center">
    <h1 class="text-2xl font-semibold">Empty Nuxt project by Sphe.</h1>
  </div>
</template>`