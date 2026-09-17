export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,

    onRequest({ options }) {
      // auth later
    },

    onResponseError({ response }) {
      // 401 / 403 handling later
    },
  })

  return {
    provide: {
      api,
    },
  }
})