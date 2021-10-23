import {
  assert,
  AssertionError,
  Logger,
  LogHandler
  } from '../ts';

let logMessages: string[] = [];

const TestLoggingStrategy: LogHandler = (level, name, message) => {
  logMessages.push(message);
};

const CUSTOM_LOGGER = new Logger()
  .withName("test logger")
  .withHandler(TestLoggingStrategy);

describe(assert, () => {
  beforeEach(() => {
    logMessages = [];
  });

  it("errors if the condition is false", () => {
    expect(() => assert(false, "This should always throw")).toThrow();
  });

  it("does not error when the condition is true", () => {
    expect(() => assert(true, "This should never throw")).not.toThrow();
  });

  it("errors with a specific message when passed a string.", () => {
    expect(() => assert(false, "specific string")).toThrow("specific string");
  });

  it("errors with a specific error when passed an error", () => {
    expect(() => assert(false, new TypeError("Type error"))).toThrow(TypeError);
  });

  it("logs the error string if passed in", () => {
    expect(() => assert(CUSTOM_LOGGER, false, "specific string")).toThrow(
      "specific string"
    );
    expect(logMessages[logMessages.length - 1]).toEqual("specific string");
  });

  it("logs the error message if error is passed in", () => {
    expect(() =>
      assert(CUSTOM_LOGGER, false, new TypeError("specific string"))
    ).toThrow(TypeError);
    expect(logMessages[logMessages.length - 1]).toEqual("specific string");
  });
});
