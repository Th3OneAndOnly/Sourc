export declare function partial<Params extends unknown[], Inputs extends unknown[], Return>(func: (...args: [...Params, ...Inputs]) => Return, ...params: Params): (...args: Inputs) => Return;
export declare function clamp(min: number, max: number, num: number): number;
