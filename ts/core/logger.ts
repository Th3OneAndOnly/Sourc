import { assert } from './tool/assert';
/**
 * Tools for logger utilities in Sourc.
 * @module
 */

class LoggingError extends Error {}

/**
 * Represents a bit field a {@link Logger} uses to determine if it should log a message or not.
 * You likely won't use this very much unless you're writing your own {@link LogHandler}.
 */
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

/**
 * Function type used in a {@link Logger} to handle what happens when a message is logged.
 * @param level - the {@link LogLevel} of the message.
 * @param name - the name of the logger used to log the message.
 * @param message - the actual message.
 */
export type LogHandler = (
  level: LogLevel,
  name: string,
  message: string
) => void;

/**
 * Utility class to help with collecting and monitoring logs in your Sourc applications.
 * Creating one is easy:
 * ```typescript
 * let my_logger = new Logger().withName("Your name here").withStrategy(() => {});
 * ```
 * You can now use it like so:
 * ```typescript
 * my_logger.ERROR("Your message here");
 * ```
 * Or of course any variant of TRACE, DEBUG, INFO, WARN, ERROR, or FATAL.
 * You won't see anything happen though, until you register a {@link LogHandler}.
 * A default one we ship is the {@link ConsoleLogStrategy}, that logs messages to the web console with colors.
 */
export class Logger {
  private _name: string = "";

  private _logLevels: LogLevel = LogLevelALL;

  private _logHandler: LogHandler | null = null;

  public enabled: boolean = true;

  private enableLevel(level: LogLevel) {
    this._logLevels = this._logLevels | level;
  }

  private disableLevel(level: LogLevel) {
    this._logLevels = this._logLevels ^ level;
  }

  private logMessage(level: LogLevel, message: string) {
    assert(
      this._logHandler != null,
      new LoggingError("No LogHandler registered!")
    );
    if (this.enabled && this._logLevels & level) {
      this._logHandler(level, this._name, message);
    }
  }

  public registerLogHandler(strategy: LogHandler) {
    this._logHandler = strategy;
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

  /**
   * Traces the value and returns it back.
   * @param obj - The object to trace
   * @param [name] - If you want, you can associate a name with the object.
   */
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

  /**
   * Configures this logger to be a copy of another.
   * @param other - Other logger to copy.
   */
  public configured(other: this): this {
    this.enabled = other.enabled;
    this._logLevels = other._logLevels;
    this._logHandler = other._logHandler;
    return this;
  }

  public withHandler(strategy: LogHandler): this {
    this.registerLogHandler(strategy);
    return this;
  }

  public withName(name: string): this {
    this._name = name;
    return this;
  }
}

/* istanbul ignore next */
/**
 * Standard log strategy that is used by default in all of Sourc's loggers.
 * When it receives a log message, it prints to the web console in the format: `[NAME] LEVEL: MSG`.
 * It also colors the output depending on the log level.
 */
export const ConsoleLogStrategy: LogHandler = (level, name, message) => {
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

/**
 * A collection of loggers tied to string keys that allow for bulk configuration of loggers.
 * @template T - A type representation of the string to loggers map-object, allowing for precise typing for the collection.
 */
export class LoggerPool<T extends { [s: string]: Logger }> {
  constructor(private _loggers: T) {}

  /**
   * Registers logging strategy for every logger
   * @param strategy - the strategy to register.
   */
  public registerLoggingHandler(strategy: LogHandler) {
    for (let logger of Object.values(this._loggers)) {
      logger.registerLogHandler(strategy);
    }
  }

  public bulkEnableTrace(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enableTrace();
    }
    return this;
  }

  public bulkDisableTrace(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.disableTrace();
    }
    return this;
  }

  public bulkEnableDebug(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enableDebug();
    }
    return this;
  }

  public bulkDisableDebug(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.disableDebug();
    }
    return this;
  }

  public bulkEnableInfo(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enableInfo();
    }
    return this;
  }

  public bulkDisableInfo(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.disableInfo();
    }
    return this;
  }

  public bulkEnableWarn(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enableWarn();
    }
    return this;
  }

  public bulkDisableWarn(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.disableWarn();
    }
    return this;
  }

  public bulkEnableError(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enableError();
    }
    return this;
  }

  public bulkDisableError(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.disableError();
    }
    return this;
  }

  public bulkEnableFatal(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enableFatal();
    }
    return this;
  }

  public bulkDisableFatal(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.disableFatal();
    }
    return this;
  }

  /**
   * Enables a specific logger
   * @param loggerName - the name of the logger to enable. If you instantiate this class with a `const` object, this property will be typed to the keys of your object.
   */
  public enableLogger(loggerName: keyof T): this {
    const logger = this._loggers[loggerName];
    assert(logger != null, "Name is not a valid logger!");
    logger.enabled = true;
    return this;
  }

  /**
   * Disables a specific logger
   * @param loggerName - the name of the logger to disable. If you instantiate this class with a `const` object, this property will be typed to the keys of your object.
   */
  public disableLogger(loggerName: keyof T): this {
    const logger = this._loggers[loggerName];
    assert(logger != null, "Name is not a valid logger!");
    logger.enabled = false;
    return this;
  }

  public enableAll(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enabled = true;
    }
    return this;
  }

  public disableAll(): this {
    for (let logger of Object.values(this._loggers)) {
      logger.enabled = false;
    }
    return this;
  }
}

/**
 * The default client logger you should use in your applications. It comes pre-configured with a name and logging strategy.
 */
export const CLIENT_LOGGER = new Logger().withName("CLIENT_SOURC_APP");
CLIENT_LOGGER.registerLogHandler(ConsoleLogStrategy);
