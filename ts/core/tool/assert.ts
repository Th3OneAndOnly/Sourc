import { Logger } from "../logger";

export class AssertionError extends Error {}

export function assert(
  logger: Logger,
  condition: boolean,
  msgOrError: string | Error
): asserts condition;
export function assert(
  condition: boolean,
  msgOrError: string | Error
): asserts condition;
export function assert(
  loggerOrCondition: Logger | boolean,
  conditionOrMsgOrError: boolean | string | Error,
  maybeMsgOrError?: string | Error
) {
  if (loggerOrCondition instanceof Logger) {
    const logger = loggerOrCondition;
    const condition = <boolean>conditionOrMsgOrError;
    const msgOrError = <string | Error>maybeMsgOrError;
    const error =
      typeof msgOrError === "string"
        ? new AssertionError(msgOrError)
        : msgOrError;
    if (!condition) {
      logger.FATAL(error.message);
      throw error;
    }
  } else {
    const condition = loggerOrCondition;
    const msgOrError = <string | Error>conditionOrMsgOrError;
    const error =
      typeof msgOrError === "string"
        ? new AssertionError(msgOrError)
        : msgOrError;
    if (!condition) {
      throw error;
    }
  }
}

export const assertWithLogger = assert as (
  logger: Logger,
  condition: boolean,
  msgOrError: string | Error
) => asserts condition;

export const assertWithoutLogger = assert as (
  condition: boolean,
  msgOrError: string | Error
) => asserts condition;
