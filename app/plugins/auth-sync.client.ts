import { useAuthStore } from "~/stores/auth";
import { useResetStores } from "~/composables/useResetStores";
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const { resetAllStores } = useResetStores();
  const channel = new BroadcastChannel("auth");

  channel.addEventListener("message", async (event) => {
    if (event.data?.type !== "logout") {
      return;
    }
    resetAllStores();
    authStore.clearAuth();

    await navigateTo("/login");
  });
});
