export declare enum LogLevel {
    TRACE = 1,
    DEBUG = 2,
    INFO = 4,
    WARN = 8,
    ERROR = 16,
    FATAL = 32
}
export declare type LogStrategy = (level: LogLevel, name: string, message: string) => void;
export declare class Logger {
    private name;
    private logLevels;
    private logStrategy;
    enabled: boolean;
    private enableLevel;
    private disableLevel;
    private logMessage;
    registerLoggingStrategy(strategy: LogStrategy): void;
    enableTrace(): this;
    disableTrace(): this;
    enableDebug(): this;
    disableDebug(): this;
    enableInfo(): this;
    disableInfo(): this;
    enableWarn(): this;
    disableWarn(): this;
    enableError(): this;
    disableError(): this;
    enableFatal(): this;
    disableFatal(): this;
    TRACE(msg: string): void;
    TRACK<T>(obj: T, name?: string): T;
    DEBUG(msg: string): void;
    INFO(msg: string): void;
    WARN(msg: string): void;
    ERROR(msg: string): void;
    FATAL(msg: string): void;
    configured(other: this): this;
    withStrategy(strategy: LogStrategy): this;
    withName(name: string): this;
}
export declare const ConsoleLogStrategy: LogStrategy;
export declare class LoggerPool<T extends {
    [s: string]: Logger;
}> {
    private loggers;
    constructor(loggers: T);
    registerLoggingStrategy(strategy: LogStrategy): void;
    bulkEnableTrace(): this;
    bulkDisableTrace(): this;
    bulkEnableDebug(): this;
    bulkDisableDebug(): this;
    bulkEnableInfo(): this;
    bulkDisableInfo(): this;
    bulkEnableWarn(): this;
    bulkDisableWarn(): this;
    bulkEnableError(): this;
    bulkDisableError(): this;
    bulkEnableFatal(): this;
    bulkDisableFatal(): this;
    enableLogger(loggerName: keyof T): this;
    disableLogger(loggerName: keyof T): this;
    enableAll(): this;
    disableAll(): this;
}
export declare const CLIENT_LOGGER: Logger;
