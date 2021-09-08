import { assert } from './assert';

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

// new ComposableFunction().runOne().if(cond, func).if(cond, func).withArgs().try();

export class FunctionDispatcher<Params extends unknown[]> {
  private isRunningOne = false;
  private isValid = true;
  private runFunctions: ((...args: Params) => unknown)[] = [];

  public runOne(): this {
    this.isRunningOne = true;
    return this;
  }

  public runAny(): this {
    this.isRunningOne = false;
    return this;
  }

  public if(cond: boolean, func: (...args: Params) => unknown): this {
    if (cond) this.runFunctions.push(func);
    return this;
  }

  public require(
    cond: boolean,
    onFail = (): unknown => {
      return;
    }
  ): this {
    if (!cond) {
      this.isValid = false;
      onFail();
    }
    return this;
  }

  public try(...args: Params) {
    if (!this.isValid) return;
    if (this.isRunningOne && this.runFunctions.length > 0) {
      this.runFunctions[0](...args);
    } else {
      for (let func of this.runFunctions) {
        func(...args);
      }
    }
  }
}
