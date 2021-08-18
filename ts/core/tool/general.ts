export function partial<
  Params extends unknown[],
  Inputs extends unknown[],
  Return
>(
  func: (...args: [...Params, ...Inputs]) => Return,
  ...params: Params
): (...args: Inputs) => Return {
  return function (...inner: Inputs) {
    return func(...params, ...inner);
  };
}

export function clamp(min: number, max: number, num: number): number {
  return Math.min(Math.max(min, num), max);
}
