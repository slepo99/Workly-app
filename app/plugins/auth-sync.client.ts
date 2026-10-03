import { useAuthStore } from "~/stores/auth"

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const channel = new BroadcastChannel("auth")

  channel.addEventListener("message", async (event) => {
    if (event.data?.type !== "logout") {
      return
    }

    authStore.clearAuth()

    await navigateTo("/login")
  })
})