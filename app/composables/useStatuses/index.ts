import { PROJECT_STATUSES } from "~/constants/projectStatuses";
import { useI18n } from "#imports";
export function useStatuses() {
  const { t } = useI18n();
  const projectStatuses = computed(() => {
    return [
      {
        label: t("projects.statuses.active"),
        value: PROJECT_STATUSES.ACTIVE,
      },
      {
        label: t("projects.statuses.onHold"),
        value: PROJECT_STATUSES.ON_HOLD,
      },
      {
        label: t("projects.statuses.completed"),
        value: PROJECT_STATUSES.COMPLETED,
      },
      {
        label: t("projects.statuses.cancelled"),
        value: PROJECT_STATUSES.CANCELLED,
      },
    ];
  });
  const getProjectStatusColor = (status: string) => {
    if (PROJECT_STATUSES.ACTIVE === status) {
      return "success";
    } else if (PROJECT_STATUSES.COMPLETED === status) {
      return "info";
    } else if (PROJECT_STATUSES.CANCELLED === status) {
      return "error";
    } else if (PROJECT_STATUSES.ON_HOLD === status) {
      return "warning";
    }
  };
  return { projectStatuses, getProjectStatusColor };
}
