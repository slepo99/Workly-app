import { useDebounceFn } from "@vueuse/core"
import { DEBOUNCE_DELAY } from "~/constants/api"

export function useDebouncedFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = DEBOUNCE_DELAY,
) {
  return useDebounceFn(fn, delay)
}

// example to use 
// const handleSearch = useDebouncedFn(async (value: string) => {
//   await dashboardStore.searchTasks(value)
// })