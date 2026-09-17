// nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '/api',
    },
  },
   imports: {
    dirs: [
      '~/composables',
      '~/composables/api/*/index.{ts,js,mjs,mts}',
    ],
  },
})