export function getProgressColor(
  percent: number,
): "error" | "warning" | "info" | "success" {
  if (percent < 20) {
    return "error";
  }

  if (percent < 40) {
    return "warning";
  }

  if (percent < 60) {
    return "info";
  }

  return "success";
}
