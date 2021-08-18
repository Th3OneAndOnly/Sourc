"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_LOGGER = exports.LoggerPool = exports.ConsoleLogStrategy = exports.Logger = exports.LogLevel = void 0;
var assert_js_1 = require("./tool/assert.js");
var LoggingError = /** @class */ (function (_super) {
    __extends(LoggingError, _super);
    function LoggingError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LoggingError;
}(Error));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 1] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 2] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 4] = "INFO";
    LogLevel[LogLevel["WARN"] = 8] = "WARN";
    LogLevel[LogLevel["ERROR"] = 16] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 32] = "FATAL";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogLevelALL = LogLevel.TRACE |
    LogLevel.DEBUG |
    LogLevel.INFO |
    LogLevel.WARN |
    LogLevel.ERROR |
    LogLevel.FATAL;
var Logger = /** @class */ (function () {
    function Logger() {
        this.name = "";
        this.logLevels = LogLevelALL;
        this.logStrategy = null;
        this.enabled = true;
    }
    Logger.prototype.enableLevel = function (level) {
        this.logLevels = this.logLevels | level;
    };
    Logger.prototype.disableLevel = function (level) {
        this.logLevels = this.logLevels ^ level;
    };
    Logger.prototype.logMessage = function (level, message) {
        if (this.logStrategy == null) {
            throw new LoggingError("No LogStrategy registered!");
        }
        if (this.enabled && this.logLevels & level) {
            this.logStrategy(level, this.name, message);
        }
    };
    Logger.prototype.registerLoggingStrategy = function (strategy) {
        this.logStrategy = strategy;
    };
    Logger.prototype.enableTrace = function () {
        this.enableLevel(LogLevel.TRACE);
        return this;
    };
    Logger.prototype.disableTrace = function () {
        this.disableLevel(LogLevel.TRACE);
        return this;
    };
    Logger.prototype.enableDebug = function () {
        this.enableLevel(LogLevel.DEBUG);
        return this;
    };
    Logger.prototype.disableDebug = function () {
        this.disableLevel(LogLevel.DEBUG);
        return this;
    };
    Logger.prototype.enableInfo = function () {
        this.enableLevel(LogLevel.INFO);
        return this;
    };
    Logger.prototype.disableInfo = function () {
        this.disableLevel(LogLevel.INFO);
        return this;
    };
    Logger.prototype.enableWarn = function () {
        this.enableLevel(LogLevel.WARN);
        return this;
    };
    Logger.prototype.disableWarn = function () {
        this.disableLevel(LogLevel.WARN);
        return this;
    };
    Logger.prototype.enableError = function () {
        this.enableLevel(LogLevel.ERROR);
        return this;
    };
    Logger.prototype.disableError = function () {
        this.disableLevel(LogLevel.ERROR);
        return this;
    };
    Logger.prototype.enableFatal = function () {
        this.enableLevel(LogLevel.FATAL);
        return this;
    };
    Logger.prototype.disableFatal = function () {
        this.disableLevel(LogLevel.FATAL);
        return this;
    };
    Logger.prototype.TRACE = function (msg) {
        this.logMessage(LogLevel.TRACE, msg);
    };
    Logger.prototype.TRACK = function (obj, name) {
        this.logMessage(LogLevel.TRACE, "" + (name ? name + ": " : "") + obj);
        return obj;
    };
    Logger.prototype.DEBUG = function (msg) {
        this.logMessage(LogLevel.DEBUG, msg);
    };
    Logger.prototype.INFO = function (msg) {
        this.logMessage(LogLevel.INFO, msg);
    };
    Logger.prototype.WARN = function (msg) {
        this.logMessage(LogLevel.WARN, msg);
    };
    Logger.prototype.ERROR = function (msg) {
        this.logMessage(LogLevel.ERROR, msg);
    };
    Logger.prototype.FATAL = function (msg) {
        this.logMessage(LogLevel.FATAL, msg);
    };
    Logger.prototype.configured = function (other) {
        this.enabled = other.enabled;
        this.logLevels = other.logLevels;
        this.logStrategy = other.logStrategy;
        return this;
    };
    Logger.prototype.withStrategy = function (strategy) {
        this.registerLoggingStrategy(strategy);
        return this;
    };
    Logger.prototype.withName = function (name) {
        this.name = name;
        return this;
    };
    return Logger;
}());
exports.Logger = Logger;
var ConsoleLogStrategy = function (level, name, message) {
    var _a;
    var LogLevelToCss = (_a = {},
        _a[LogLevel.TRACE] = "color: hsl(0, 0%, 35%);",
        _a[LogLevel.DEBUG] = "color: hsl(0, 0%, 45%);",
        _a[LogLevel.INFO] = "color: white;",
        _a[LogLevel.WARN] = "color: orange;",
        _a[LogLevel.ERROR] = "color: hsl(15, 90%, 65%);",
        _a[LogLevel.FATAL] = "color: red; font-weight: bold;",
        _a);
    console.log("%c[" + name + "] " + LogLevel[level] + ": " + message, LogLevelToCss[level]);
};
exports.ConsoleLogStrategy = ConsoleLogStrategy;
var LoggerPool = /** @class */ (function () {
    function LoggerPool(loggers) {
        this.loggers = loggers;
    }
    LoggerPool.prototype.registerLoggingStrategy = function (strategy) {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.registerLoggingStrategy(strategy);
        }
    };
    LoggerPool.prototype.bulkEnableTrace = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enableTrace();
        }
        return this;
    };
    LoggerPool.prototype.bulkDisableTrace = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.disableTrace();
        }
        return this;
    };
    LoggerPool.prototype.bulkEnableDebug = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enableDebug();
        }
        return this;
    };
    LoggerPool.prototype.bulkDisableDebug = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.disableDebug();
        }
        return this;
    };
    LoggerPool.prototype.bulkEnableInfo = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enableInfo();
        }
        return this;
    };
    LoggerPool.prototype.bulkDisableInfo = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.disableInfo();
        }
        return this;
    };
    LoggerPool.prototype.bulkEnableWarn = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enableWarn();
        }
        return this;
    };
    LoggerPool.prototype.bulkDisableWarn = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.disableWarn();
        }
        return this;
    };
    LoggerPool.prototype.bulkEnableError = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enableError();
        }
        return this;
    };
    LoggerPool.prototype.bulkDisableError = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.disableError();
        }
        return this;
    };
    LoggerPool.prototype.bulkEnableFatal = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enableFatal();
        }
        return this;
    };
    LoggerPool.prototype.bulkDisableFatal = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.disableFatal();
        }
        return this;
    };
    LoggerPool.prototype.enableLogger = function (loggerName) {
        var logger = this.loggers[loggerName];
        assert_js_1.assert(logger != null, "Name is not a valid logger!");
        logger.enabled = true;
        return this;
    };
    LoggerPool.prototype.disableLogger = function (loggerName) {
        var logger = this.loggers[loggerName];
        assert_js_1.assert(logger != null, "Name is not a valid logger!");
        logger.enabled = false;
        return this;
    };
    LoggerPool.prototype.enableAll = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enabled = true;
        }
        return this;
    };
    LoggerPool.prototype.disableAll = function () {
        for (var _i = 0, _a = Object.values(this.loggers); _i < _a.length; _i++) {
            var logger = _a[_i];
            logger.enabled = false;
        }
        return this;
    };
    return LoggerPool;
}());
exports.LoggerPool = LoggerPool;
exports.CLIENT_LOGGER = new Logger().withName("CLIENT_SOURC_APP");
exports.CLIENT_LOGGER.registerLoggingStrategy(exports.ConsoleLogStrategy);
