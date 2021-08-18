"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourcPlugin = exports.PluginConfig = exports.PluginProvider = exports.EditorState = void 0;
var private_loggers_js_1 = require("./private-loggers.js");
var string_js_1 = require("./tool/string.js");
var EditorState = /** @class */ (function () {
    function EditorState(_content, _selection) {
        this._content = _content;
        this._selection = _selection;
    }
    Object.defineProperty(EditorState.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EditorState.prototype, "selection", {
        get: function () {
            return this._selection;
        },
        enumerable: false,
        configurable: true
    });
    EditorState.prototype.insertText = function (text, position) {
        if (position < 0 || position > this._content.length) {
            private_loggers_js_1.PLUGIN_LOGGER.ERROR(string_js_1.pp(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Cannot insert text at position ", ""], ["Cannot insert text at position ", ""])), position));
            return;
        }
        var old = this._content;
        this._content = old.slice(0, position) + text + old.slice(position);
    };
    EditorState.prototype.deleteText = function (position, length) {
        if (position < 0 || position > this._content.length) {
            private_loggers_js_1.PLUGIN_LOGGER.ERROR(string_js_1.pp(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Cannot delete text at position ", ""], ["Cannot delete text at position ", ""])), position));
            return;
        }
        if (position + length < 0 || position + length > this._content.length) {
            private_loggers_js_1.PLUGIN_LOGGER.ERROR(string_js_1.pp(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Cannot delete text of length ", ""], ["Cannot delete text of length ", ""])), length));
            return;
        }
        var old = this._content;
        this._content = old.slice(0, position) + old.slice(position + length);
    };
    EditorState.prototype.setSelection = function (selection) {
        this._selection = selection;
    };
    return EditorState;
}());
exports.EditorState = EditorState;
var PluginProvider = /** @class */ (function () {
    function PluginProvider() {
    }
    PluginProvider.prototype.onKeyPressed = function (key, state) { };
    return PluginProvider;
}());
exports.PluginProvider = PluginProvider;
var PluginConfig = /** @class */ (function () {
    function PluginConfig(_a) {
    }
    return PluginConfig;
}());
exports.PluginConfig = PluginConfig;
var SourcPlugin = /** @class */ (function () {
    function SourcPlugin(provider, config) {
        this.provider = provider;
        this.config = config;
    }
    return SourcPlugin;
}());
exports.SourcPlugin = SourcPlugin;
var templateObject_1, templateObject_2, templateObject_3;
