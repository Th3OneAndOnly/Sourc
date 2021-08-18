"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = exports.partial = void 0;
function partial(func) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    return function () {
        var inner = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inner[_i] = arguments[_i];
        }
        return func.apply(void 0, __spreadArray(__spreadArray([], params), inner));
    };
}
exports.partial = partial;
function clamp(min, max, num) {
    return Math.min(Math.max(min, num), max);
}
exports.clamp = clamp;
