export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    headers,

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