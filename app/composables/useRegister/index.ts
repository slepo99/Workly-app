// todo => change name to useRegisterPage
import { z } from "zod";
import type { Register } from "~/composables/api/useAuthApi/types";
import { useAuthStore } from "~/stores/auth";
import { useI18n } from "#imports";
export function useRegister() {
  const authStore = useAuthStore();
  const { t } = useI18n();
  const toast = useToast();

  const state = reactive<Register>({
    name: "",
    email: "",
    password: "",
  });
  const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  async function onRegister() {
    try {
      await authStore.register(state);

      toast.add({
        title: t("register.toast.success.title"),
        description: t("register.toast.success.subTitle"),
        color: "success",
        duration: 7000,
      });
      await navigateTo("/login");
    } catch (error: any) {
      if (error?.statusCode === 409) {
        toast.add({
          title: t("register.toast.error.wrongCreds.title"),
          description: t("register.toast.error.wrongCreds.subTitle"),
          color: "error",
          duration: 7000,
        });
        return;
      }

      toast.add({
        title: t("register.toast.error.somethingWentWrong.title"),
        description: t("register.toast.error.somethingWentWrong.subTitle"),
        color: "error",
        duration: 7000,
      });
    }
  }
  return {
    state,
    schema,
    onRegister
  }
}
