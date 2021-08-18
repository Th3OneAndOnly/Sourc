"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORE_LOGGER = exports.PLUGIN_LOGGER = exports.DOM_TOOLS_LOGGER = void 0;
var logger_js_1 = require("./logger.js");
exports.DOM_TOOLS_LOGGER = new logger_js_1.Logger()
    .withName("dom-tools.ts")
    .withStrategy(logger_js_1.ConsoleLogStrategy);
exports.PLUGIN_LOGGER = new logger_js_1.Logger()
    .withName("plugin.ts")
    .withStrategy(logger_js_1.ConsoleLogStrategy);
exports.CORE_LOGGER = new logger_js_1.Logger()
    .withName("SOURC_CORE")
    .withStrategy(logger_js_1.ConsoleLogStrategy);
