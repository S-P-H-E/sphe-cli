import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image'],

  // Styling
  css: ['~/globals.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Metadata
  app: {
    head: {
      title: 'Nuxt',
      meta: [
        { name: 'description', content: 'Empty Nuxt project by Sphe.' }
      ],
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})