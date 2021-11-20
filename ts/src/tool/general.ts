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

export class FunctionDispatcher<Params extends unknown[], Return = unknown> {
  private isRunningOne = false;
  private isValid = true;
  private runFunctions: ((...args: Params) => Return)[] = [];

  public runOne(): this {
    this.isRunningOne = true;
    return this;
  }

  public runAny(): this {
    this.isRunningOne = false;
    return this;
  }

  public if(cond: boolean, func: (...args: Params) => Return): this {
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

  public try(...args: Params): Return[] {
    if (!this.isValid) return [];
    const out = [];
    if (this.isRunningOne && this.runFunctions.length > 0) {
      out.push(this.runFunctions[0](...args));
    } else {
      for (let func of this.runFunctions) {
        out.push(func(...args));
      }
    }
    return out;
  }
}
