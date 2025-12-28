export const SUPPORTED_PROJECTS = [
  { name: 'Next JS', type: 'next', category: 'Frontend' },
  { name: 'Nuxt', type: 'nuxt', category: 'Frontend' },
  { name: 'Svelte', type: 'svelte', category: 'Frontend' },
  { name: 'Node', type: 'node', category: 'Backend' },
] as const

export const SUPPORTED_PACKAGES = [
  { pkName: 'npm', pkInstall: 'npx' },
  { pkName: 'bun', pkInstall: 'bunx' },
] as const