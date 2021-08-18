import { Logger } from "../logger.js";
export declare class AssertionError extends Error {
}
export declare function assert(logger: Logger, condition: boolean, msgOrError: string | Error): asserts condition;
export declare function assert(condition: boolean, msgOrError: string | Error): asserts condition;
export declare const assertWithLogger: (logger: Logger, condition: boolean, msgOrError: string | Error) => asserts condition;
export declare const assertWithoutLogger: (condition: boolean, msgOrError: string | Error) => asserts condition;
