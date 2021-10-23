import {
  Logger,
  LoggerPool,
  LogHandler,
  LogLevel
  } from '../ts';

type LogList = { level: LogLevel; name: string; message: string }[];

function testLogAll(logger: Logger, message: string) {
  logger.TRACE(message);
  logger.DEBUG(message);
  logger.INFO(message);
  logger.WARN(message);
  logger.ERROR(message);
  logger.FATAL(message);
}

describe(Logger, () => {
  describe("enable/disable", () => {
    it("has everything enabled by default", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      testLogAll(
        new Logger().withName("Test Logger").withHandler(TestLogHandler),
        "Test Message"
      );
      expect(logs.length).toEqual(6);
    });

    it("allows each to be disabled in turn", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const logger = new Logger()
        .withName("Test Logger")
        .withHandler(TestLogHandler);

      testLogAll(logger, "Test Message");
      expect(logs.length).toEqual(6);
      logs = [];

      logger.disableTrace();
      testLogAll(logger, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.TRACE);
      }
      logger.enableTrace();
      logs = [];

      logger.disableDebug();
      testLogAll(logger, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.DEBUG);
      }
      logger.enableDebug();
      logs = [];

      logger.disableInfo();
      testLogAll(logger, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.INFO);
      }
      logger.enableInfo();
      logs = [];

      logger.disableWarn();
      testLogAll(logger, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.WARN);
      }
      logger.enableWarn();
      logs = [];

      logger.disableError();
      testLogAll(logger, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.ERROR);
      }
      logger.enableError();
      logs = [];

      logger.disableFatal();
      testLogAll(logger, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.FATAL);
      }
      logger.enableFatal();
      logs = [];

      testLogAll(logger, "Test Message");
      expect(logs.length).toEqual(6);
      logs = [];
    });
  });

  describe(".enabled", () => {
    it("can disable the logger entirely", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const logger = new Logger().withHandler(TestLogHandler);

      logger.enabled = false;
      testLogAll(logger, "This should not log.");
      expect(logs.length).toEqual(0);
    });
  });

  describe(".TRACK", () => {
    it("returns back the value traced", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      let logger = new Logger()
        .withName("Test Logger")
        .withHandler(TestLogHandler);

      let val = logger.TRACK("hello");
      expect(logs[0]).toEqual({
        level: LogLevel.TRACE,
        name: "Test Logger",
        message: "hello",
      });
      expect(val).toEqual("hello");

      let otherVal = logger.TRACK("world", "world");
      expect(logs[1]).toEqual({
        level: LogLevel.TRACE,
        name: "Test Logger",
        message: "world: world",
      });
      expect(otherVal).toEqual("world");
    });
  });

  describe(".configured", () => {
    it("configures a logger based on another", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      let logger = new Logger()
        .withName("Wacky Name")
        .withHandler(TestLogHandler);

      logger.disableInfo();

      let otherLogger = new Logger().configured(logger).withName("Other Name");

      testLogAll(logger, "Test Message");
      for (let { level, name, message } of logs) {
        expect(name).toEqual("Wacky Name");
        expect(message).toEqual("Test Message");
        expect(level).not.toBe(LogLevel.INFO);
      }
      logs = [];

      testLogAll(otherLogger, "Test Message");
      for (let { level, name, message } of logs) {
        expect(name).toEqual("Other Name");
        expect(message).toEqual("Test Message");
        expect(level).not.toBe(LogLevel.INFO);
      }
      logs = [];
    });
  });
});

describe(LoggerPool, () => {
  describe("#registerLoggingHandler", () => {
    it("registers the handler for every logger involved", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const A = new Logger().withName("A");
      const B = new Logger().withName("B");
      const C = new Logger().withName("C");
      const D = new Logger().withName("D");
      const pool = new LoggerPool({
        A: A,
        B: B,
        C: C,
        D: D,
      });

      pool.registerLoggingHandler(TestLogHandler);

      expect(() => {
        testLogAll(A, "");
        testLogAll(B, "");
        testLogAll(C, "");
        testLogAll(D, "");
      }).not.toThrow();
    });
  });

  describe("bulk enable/disable log levels", () => {
    it("has everything enabled by default", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const A = new Logger().withName("A");
      const B = new Logger().withName("B");
      const C = new Logger().withName("C");
      const D = new Logger().withName("D");
      const pool = new LoggerPool({
        A: A,
        B: B,
        C: C,
        D: D,
      });

      pool.registerLoggingHandler(TestLogHandler);

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(6 * 4);
    });

    it("allows each to be disabled in turn", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const A = new Logger().withName("A");
      const B = new Logger().withName("B");
      const C = new Logger().withName("C");
      const D = new Logger().withName("D");
      const pool = new LoggerPool({
        A: A,
        B: B,
        C: C,
        D: D,
      });

      pool.registerLoggingHandler(TestLogHandler);

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(6 * 4);
      logs = [];

      pool.bulkDisableTrace();
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.TRACE);
      }
      pool.bulkEnableTrace();
      logs = [];

      pool.bulkDisableDebug();
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.DEBUG);
      }
      pool.bulkEnableDebug();
      logs = [];

      pool.bulkDisableInfo();
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.INFO);
      }
      pool.bulkEnableInfo();
      logs = [];

      pool.bulkDisableWarn();
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.WARN);
      }
      pool.bulkEnableWarn();
      logs = [];

      pool.bulkDisableError();
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.ERROR);
      }
      pool.bulkEnableError();
      logs = [];

      pool.bulkDisableFatal();
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { level } of logs) {
        expect(level).not.toBe(LogLevel.FATAL);
      }
      pool.bulkEnableFatal();
      logs = [];

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(6 * 4);
      logs = [];
    });
  });

  describe("enabling / disabling", () => {
    it("is enabled by default", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const A = new Logger().withName("A");
      const B = new Logger().withName("B");
      const C = new Logger().withName("C");
      const D = new Logger().withName("D");
      const pool = new LoggerPool({
        A: A,
        B: B,
        C: C,
        D: D,
      });

      pool.registerLoggingHandler(TestLogHandler);

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(6 * 4);
    });

    it("can disable individual loggers.", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const A = new Logger().withName("A");
      const B = new Logger().withName("B");
      const C = new Logger().withName("C");
      const D = new Logger().withName("D");
      const pool = new LoggerPool({
        A: A,
        B: B,
        C: C,
        D: D,
      });

      pool.registerLoggingHandler(TestLogHandler);

      pool.disableLogger("B");

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      for (let { name } of logs) {
        expect(name).not.toBe("B");
      }
      logs = [];

      pool.enableLogger("B");
      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(6 * 4);
    });

    it("can disable everything", () => {
      let logs: LogList = [];
      const TestLogHandler: LogHandler = (level, name, message) => {
        logs.push({ level, name, message });
      };

      const A = new Logger().withName("A");
      const B = new Logger().withName("B");
      const C = new Logger().withName("C");
      const D = new Logger().withName("D");
      const pool = new LoggerPool({
        A: A,
        B: B,
        C: C,
        D: D,
      });

      pool.registerLoggingHandler(TestLogHandler);

      pool.disableAll();

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(0);

      pool.enableAll();

      testLogAll(A, "Test Message");
      testLogAll(B, "Test Message");
      testLogAll(C, "Test Message");
      testLogAll(D, "Test Message");
      expect(logs.length).toEqual(6 * 4);
    });
  });
});
