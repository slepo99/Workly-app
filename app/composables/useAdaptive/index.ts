import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

export function useAdaptive() {
  const breakpoints = useBreakpoints(breakpointsTailwind);

  const isMobile = breakpoints.smaller("sm");
  const isTablet = breakpoints.between("sm", "lg");
  const isDesktop = breakpoints.greaterOrEqual("lg");
  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}
