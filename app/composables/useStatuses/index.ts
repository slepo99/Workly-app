import { PROJECT_STATUSES } from "~/constants/projectStatuses";
import { TASK_STATUSES, type TaskStatus } from "~/constants/taskStatuses";
import { useI18n } from "#imports";

export function useStatuses() {
  const { t } = useI18n();

  const getProjectStatuses = computed(() => {
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

  const getProjectStatusLabel = (status: string) => {
    return (
      getProjectStatuses.value.find((s) => s.value === status)?.label || ""
    );
  };

  const getTaskStatuses = computed(() => {
    return [
      {
        label: "Canceled",
        value: TASK_STATUSES.CANCELLED,
      },
      {
        label: "Completed",
        value: TASK_STATUSES.COMPLETED,
      },
      {
        label: "In Progress",
        value: TASK_STATUSES.IN_PROGRESS,
      },
      {
        label: "Pending",
        value: TASK_STATUSES.PENDING,
      },
    ];
  });
  const getTaskStatusLabel = (status: TaskStatus) => {
    return (
      getTaskStatuses.value.find((stat) => stat.value === status)?.label ?? ""
    );
  };

  const getTaskStatusColors = (status: string) => {
    if (TASK_STATUSES.CANCELLED === status) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    } else if (TASK_STATUSES.COMPLETED === status) {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    } else if (TASK_STATUSES.IN_PROGRESS === status) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    } else if (TASK_STATUSES.PENDING === status) {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
  };
  type TaskTermination = {
    label: "low" | "medium" | "high";
    color: "success" | "warning" | "error";
  };

  const getTaskTermination = (endDate: string | Date | null,): TaskTermination => {
    if (!endDate) {
      return {
        label: "low",
        color: "success",
      };
    }

    const deadlineTime = new Date(endDate).getTime();

    if (Number.isNaN(deadlineTime)) {
      return {
        label: "low",
        color: "success",
      };
    }

    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const millisecondsLeft = deadlineTime - Date.now();
    const daysLeft = millisecondsLeft / millisecondsInDay;

    if (daysLeft > 4) {
      return {
        label: "low",
        color: "success",
      };
    }

    if (daysLeft > 1) {
      return {
        label: "medium",
        color: "warning",
      };
    }

    return {
      label: "high",
      color: "error",
    };
  };
  return {
    getProjectStatuses,
    getProjectStatusColor,
    getProjectStatusLabel,
    getTaskStatuses,
    getTaskStatusColors,
    getTaskStatusLabel,
    getTaskTermination
  };
}
