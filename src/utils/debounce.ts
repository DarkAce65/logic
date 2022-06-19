export const debounce = <A extends unknown[]>(
  f: (...args: A) => void,
  delay: number
): ((...args: A) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => f(...args), delay);
  };
};
