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
exports.assertWithoutLogger = exports.assertWithLogger = exports.assert = exports.AssertionError = void 0;
var logger_js_1 = require("../logger.js");
var AssertionError = /** @class */ (function (_super) {
    __extends(AssertionError, _super);
    function AssertionError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AssertionError;
}(Error));
exports.AssertionError = AssertionError;
function assert(loggerOrCondition, conditionOrMsgOrError, maybeMsgOrError) {
    if (loggerOrCondition instanceof logger_js_1.Logger) {
        var logger = loggerOrCondition;
        var condition = conditionOrMsgOrError;
        var msgOrError = maybeMsgOrError;
        var error = typeof msgOrError === "string"
            ? new AssertionError(msgOrError)
            : msgOrError;
        if (!condition) {
            logger.FATAL(error.message);
            throw error;
        }
    }
    else {
        var condition = loggerOrCondition;
        var msgOrError = conditionOrMsgOrError;
        var error = typeof msgOrError === "string"
            ? new AssertionError(msgOrError)
            : msgOrError;
        if (!condition) {
            throw error;
        }
    }
}
exports.assert = assert;
exports.assertWithLogger = assert;
exports.assertWithoutLogger = assert;
