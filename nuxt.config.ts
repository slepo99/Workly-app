// nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: true,
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: "/api",
    },
  },
  imports: {
    dirs: ["~/composables", "~/composables/api/*/index.{ts,js,mjs,mts}"],
  },
  modules: ["@nuxt/ui", "@nuxtjs/i18n", '@pinia/nuxt'],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system",
    fallback: "light",
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "uk", name: "Українська", file: "uk.json" },
    ],
    defaultLocale: "en",
  },
});
