export const getPercentageValue = (value: number, percent: number): number => {
  return Math.round((value * percent) / 100);
};
