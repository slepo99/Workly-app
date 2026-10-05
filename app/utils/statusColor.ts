import { PROJECT_STATUSES } from "~/constants/projectStatuses";

export function getProjectStatusColor(status: string) {
  if (PROJECT_STATUSES.ACTIVE === status) {
    return "success";
  } else if (PROJECT_STATUSES.COMPLETED === status) {
    return "info";
  } else {
    return "warning";
  }
}