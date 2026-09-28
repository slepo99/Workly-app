import { useI18n } from "#imports";
import { z } from "zod";
import { useAuthStore } from "~/stores/auth";
import type { Login } from "~/composables/api/useAuthApi/types";
export function useLogin() {
  const { t } = useI18n();
  const toast = useToast();
  const authStore = useAuthStore();

  const state = reactive<Login>({
    email: "",
    password: "",
  });

  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  async function onLogin() {
    try {
      await authStore.login(state);

      if (authStore.isAuthenticated) {
        toast.add({
          title: t("login.toast.success.title"),
          description: t("login.toast.success.subTitle"),
          color: "success",
          duration: 7000,
        });

        await navigateTo("/");
      }
    } catch (error: any) {
      toast.add({
        title: t("login.toast.error.wrongCreds.title"),
        description:
          error?.data?.statusMessage ||
          t("login.toast.error.wrongCreds.subTitle"),
        color: "error",
      });
    }
  }
  return {
    state,
    schema,
    onLogin,
  };
}
