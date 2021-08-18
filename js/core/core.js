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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorePlugin = void 0;
var actions_js_1 = require("./actions.js");
var plugin_1 = require("./plugin");
var private_loggers_js_1 = require("./private-loggers.js");
var dom_tools_js_1 = require("./tool/dom-tools.js");
var string_js_1 = require("./tool/string.js");
var text_tools_js_1 = require("./tool/text-tools.js");
var SpecialKeys = Object.freeze(new Map(Object.entries({
    Enter: "\n",
})));
var IgnoredKeys = Object.freeze(["Meta"]);
var CorePluginProvider = /** @class */ (function (_super) {
    __extends(CorePluginProvider, _super);
    function CorePluginProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CorePluginProvider.prototype.onKeyPressed = function (key, state) {
        var _a;
        if (!state.selection) {
            private_loggers_js_1.CORE_LOGGER.ERROR("Key was pressed, but couldn't find the caret!");
            return;
        }
        if (IgnoredKeys.includes(key))
            return;
        key = (_a = SpecialKeys.get(key)) !== null && _a !== void 0 ? _a : key;
        var type = dom_tools_js_1.getKeyType(key);
        if (type == dom_tools_js_1.KeyType.ArrowKey) {
            this.handleArrowKey(key, state);
            return;
        }
        if (text_tools_js_1.isCaretFlat(state.selection)) {
            var location_1 = state.selection.start;
            if (type == dom_tools_js_1.KeyType.Backspace) {
                state.deleteText(location_1 - 1, 1);
                state.setSelection({
                    start: location_1 - 1,
                    end: location_1 - 1,
                });
            }
            else if (type == dom_tools_js_1.KeyType.Delete) {
                if (location_1 >= state.content.length)
                    return;
                state.deleteText(location_1, 1);
            }
            else {
                state.insertText(key, location_1);
                state.setSelection({
                    start: location_1 + 1,
                    end: location_1 + 1,
                });
            }
        }
    };
    CorePluginProvider.prototype.handleArrowKey = function (key, state) {
        var _a, _b, _c;
        var caret = 0;
        switch (key) {
            case "ArrowUp": {
                var pos = state.selection.start;
                var lines = state.content.split("\n");
                var lineNum = state.content
                    .split("")
                    .slice(0, pos)
                    .filter(function (ch) { return ch == "\n"; }).length - 1;
                var lineLength = ((_a = lines[lineNum]) === null || _a === void 0 ? void 0 : _a.length) + 1;
                var lineOffset = string_js_1.findLineOffset(state.content, pos);
                var offset = void 0;
                if (lineOffset >= lineLength) {
                    offset = 1 + lineOffset;
                }
                else {
                    offset = lineLength;
                }
                caret = pos - offset;
                break;
            }
            case "ArrowDown": {
                var pos = state.selection.end;
                var lines = state.content.split("\n");
                var lineNum = state.content
                    .split("")
                    .slice(0, pos)
                    .filter(function (ch) { return ch == "\n"; }).length + 1;
                var lineLength = ((_b = lines[lineNum]) === null || _b === void 0 ? void 0 : _b.length) + 1;
                var prevLineLength = ((_c = lines[lineNum - 1]) === null || _c === void 0 ? void 0 : _c.length) + 1;
                var lineOffset = string_js_1.findLineOffset(state.content, pos);
                var offset = void 0;
                if (lineOffset >= lineLength) {
                    offset = lineLength + prevLineLength - lineOffset - 1;
                }
                else {
                    offset = prevLineLength;
                }
                caret = pos + offset;
                break;
            }
            case "ArrowLeft":
                caret = state.selection.start - 1;
                break;
            case "ArrowRight":
                caret = state.selection.end + 1;
                break;
        }
        state.setSelection({
            start: caret,
            end: caret,
        });
    };
    CorePluginProvider.prototype.getAction = function (key, location) {
        var _a;
        var arrows = Object.freeze(
        // TODO: up/down arrow keys
        new Map(Object.entries({
            ArrowLeft: new actions_js_1.MoveCaret({
                start: location.start - 1,
                end: location.start - 1,
            }),
            ArrowRight: new actions_js_1.MoveCaret({
                start: location.start + 1,
                end: location.start + 1,
            }),
        })));
        if (arrows.has(key))
            return arrows.get(key);
        if (text_tools_js_1.isCaretFlat(location)) {
            private_loggers_js_1.CORE_LOGGER.TRACE("Caret is flat!");
            if (key == "Backspace") {
                private_loggers_js_1.CORE_LOGGER.DEBUG("Deleting one character.");
                return new actions_js_1.DeleteText(location.start - 1, 1);
            }
            else {
                key = (_a = SpecialKeys.get(key)) !== null && _a !== void 0 ? _a : key;
                private_loggers_js_1.CORE_LOGGER.DEBUG(string_js_1.pp(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Inserting one character: ", ""], ["Inserting one character: ", ""])), key));
                var action = new actions_js_1.InsertText(key, location.start);
                return action;
            }
        }
        private_loggers_js_1.CORE_LOGGER.INFO("getAction returned BlankAction.");
        return new actions_js_1.BlankAction();
    };
    return CorePluginProvider;
}(plugin_1.PluginProvider));
exports.CorePlugin = new plugin_1.SourcPlugin(new CorePluginProvider(), new plugin_1.PluginConfig({}));
var templateObject_1;
