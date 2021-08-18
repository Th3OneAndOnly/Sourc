import { assert } from "./tool/assert.js";

class LoggingError extends Error {}

export enum LogLevel {
  TRACE = 1 << 0,
  DEBUG = 1 << 1,
  INFO = 1 << 2,
  WARN = 1 << 3,
  ERROR = 1 << 4,
  FATAL = 1 << 5,
}
const LogLevelALL =
  LogLevel.TRACE |
  LogLevel.DEBUG |
  LogLevel.INFO |
  LogLevel.WARN |
  LogLevel.ERROR |
  LogLevel.FATAL;

export type LogStrategy = (
  level: LogLevel,
  name: string,
  message: string
) => void;

export class Logger {
  private name: string = "";

  private logLevels: LogLevel = LogLevelALL;

  private logStrategy: LogStrategy | null = null;

  public enabled: boolean = true;

  private enableLevel(level: LogLevel) {
    this.logLevels = this.logLevels | level;
  }

  private disableLevel(level: LogLevel) {
    this.logLevels = this.logLevels ^ level;
  }

  private logMessage(level: LogLevel, message: string) {
    if (this.logStrategy == null) {
      throw new LoggingError("No LogStrategy registered!");
    }
    if (this.enabled && this.logLevels & level) {
      this.logStrategy(level, this.name, message);
    }
  }

  public registerLoggingStrategy(strategy: LogStrategy) {
    this.logStrategy = strategy;
  }

  public enableTrace(): this {
    this.enableLevel(LogLevel.TRACE);
    return this;
  }

  public disableTrace(): this {
    this.disableLevel(LogLevel.TRACE);
    return this;
  }

  public enableDebug(): this {
    this.enableLevel(LogLevel.DEBUG);
    return this;
  }

  public disableDebug(): this {
    this.disableLevel(LogLevel.DEBUG);
    return this;
  }

  public enableInfo(): this {
    this.enableLevel(LogLevel.INFO);
    return this;
  }

  public disableInfo(): this {
    this.disableLevel(LogLevel.INFO);
    return this;
  }

  public enableWarn(): this {
    this.enableLevel(LogLevel.WARN);
    return this;
  }

  public disableWarn(): this {
    this.disableLevel(LogLevel.WARN);
    return this;
  }

  public enableError(): this {
    this.enableLevel(LogLevel.ERROR);
    return this;
  }

  public disableError(): this {
    this.disableLevel(LogLevel.ERROR);
    return this;
  }

  public enableFatal(): this {
    this.enableLevel(LogLevel.FATAL);
    return this;
  }

  public disableFatal(): this {
    this.disableLevel(LogLevel.FATAL);
    return this;
  }

  public TRACE(msg: string) {
    this.logMessage(LogLevel.TRACE, msg);
  }

  public TRACK<T>(obj: T, name?: string): T {
    this.logMessage(LogLevel.TRACE, `${name ? name + ": " : ""}${obj}`);
    return obj;
  }

  public DEBUG(msg: string) {
    this.logMessage(LogLevel.DEBUG, msg);
  }

  public INFO(msg: string) {
    this.logMessage(LogLevel.INFO, msg);
  }

  public WARN(msg: string) {
    this.logMessage(LogLevel.WARN, msg);
  }

  public ERROR(msg: string) {
    this.logMessage(LogLevel.ERROR, msg);
  }

  public FATAL(msg: string) {
    this.logMessage(LogLevel.FATAL, msg);
  }

  public configured(other: this): this {
    this.enabled = other.enabled;
    this.logLevels = other.logLevels;
    this.logStrategy = other.logStrategy;
    return this;
  }

  public withStrategy(strategy: LogStrategy): this {
    this.registerLoggingStrategy(strategy);
    return this;
  }

  public withName(name: string): this {
    this.name = name;
    return this;
  }
}

export const ConsoleLogStrategy: LogStrategy = (level, name, message) => {
  const LogLevelToCss = {
    [LogLevel.TRACE]: "color: hsl(0, 0%, 35%);",
    [LogLevel.DEBUG]: "color: hsl(0, 0%, 45%);",
    [LogLevel.INFO]: "color: white;",
    [LogLevel.WARN]: "color: orange;",
    [LogLevel.ERROR]: "color: hsl(15, 90%, 65%);",
    [LogLevel.FATAL]: "color: red; font-weight: bold;",
  };
  console.log(
    `%c[${name}] ${LogLevel[level]}: ${message}`,
    LogLevelToCss[level]
  );
};

export class LoggerPool<T extends { [s: string]: Logger }> {
  constructor(private loggers: T) {}

  public registerLoggingStrategy(strategy: LogStrategy) {
    for (let logger of Object.values(this.loggers)) {
      logger.registerLoggingStrategy(strategy);
    }
  }

  public bulkEnableTrace(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enableTrace();
    }
    return this;
  }

  public bulkDisableTrace(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.disableTrace();
    }
    return this;
  }

  public bulkEnableDebug(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enableDebug();
    }
    return this;
  }

  public bulkDisableDebug(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.disableDebug();
    }
    return this;
  }

  public bulkEnableInfo(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enableInfo();
    }
    return this;
  }

  public bulkDisableInfo(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.disableInfo();
    }
    return this;
  }

  public bulkEnableWarn(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enableWarn();
    }
    return this;
  }

  public bulkDisableWarn(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.disableWarn();
    }
    return this;
  }

  public bulkEnableError(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enableError();
    }
    return this;
  }

  public bulkDisableError(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.disableError();
    }
    return this;
  }

  public bulkEnableFatal(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enableFatal();
    }
    return this;
  }

  public bulkDisableFatal(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.disableFatal();
    }
    return this;
  }

  public enableLogger(loggerName: keyof T): this {
    const logger = this.loggers[loggerName];
    assert(logger != null, "Name is not a valid logger!");
    logger.enabled = true;
    return this;
  }

  public disableLogger(loggerName: keyof T): this {
    const logger = this.loggers[loggerName];
    assert(logger != null, "Name is not a valid logger!");
    logger.enabled = false;
    return this;
  }

  public enableAll(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enabled = true;
    }
    return this;
  }

  public disableAll(): this {
    for (let logger of Object.values(this.loggers)) {
      logger.enabled = false;
    }
    return this;
  }
}

export const CLIENT_LOGGER = new Logger().withName("CLIENT_SOURC_APP");
CLIENT_LOGGER.registerLoggingStrategy(ConsoleLogStrategy);
