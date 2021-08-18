"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTIL_LOGGERS_POOL = void 0;
var logger_js_1 = require("./logger.js");
var private_loggers_js_1 = require("./private-loggers.js");
var loggers = Object.freeze({
    DOMTOOLS: private_loggers_js_1.DOM_TOOLS_LOGGER,
    PLUGIN: private_loggers_js_1.PLUGIN_LOGGER,
    CORE: private_loggers_js_1.CORE_LOGGER,
});
exports.UTIL_LOGGERS_POOL = new logger_js_1.LoggerPool(loggers);
exports.UTIL_LOGGERS_POOL.disableAll();
