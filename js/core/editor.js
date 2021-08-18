"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEditor = void 0;
var logger_js_1 = require("./logger.js");
var conversion_js_1 = require("./tool/conversion.js");
var dom_tools_js_1 = require("./tool/dom-tools.js");
var general_js_1 = require("./tool/general.js");
var assert_js_1 = require("./tool/assert.js");
var plugin_js_1 = require("./plugin.js");
var string_js_1 = require("./tool/string.js");
var core_js_1 = require("./core.js");
var Modifiers;
(function (Modifiers) {
    Modifiers[Modifiers["NONE"] = 1] = "NONE";
    Modifiers[Modifiers["SHIFT"] = 2] = "SHIFT";
    Modifiers[Modifiers["ALT"] = 4] = "ALT";
    Modifiers[Modifiers["CTRL"] = 8] = "CTRL";
})(Modifiers || (Modifiers = {}));
var ModifierMap = Object.freeze(new Map(Object.entries({
    Shift: Modifiers.SHIFT,
    Alt: Modifiers.ALT,
    Control: Modifiers.CTRL,
})));
var TextEditor = /** @class */ (function () {
    function TextEditor(editor, overlay) {
        this.editor = editor;
        this.overlay = overlay;
        this.plugins = [];
        this.keyState = { mods: Modifiers.NONE };
        this.content = { current: "", previous: "" };
        this.name = "Sourc Editor <unknown>";
        this.LOGGER = new logger_js_1.Logger()
            .withName(this.name)
            .withStrategy(logger_js_1.ConsoleLogStrategy)
            .disableTrace()
            .disableDebug();
        this.assert = general_js_1.partial(assert_js_1.assertWithLogger, this.LOGGER);
    }
    TextEditor.prototype.initialize = function () {
        this.editor.contentEditable = "false";
        this.initializeEditor();
        this.editor.contentEditable = "true";
    };
    TextEditor.prototype.setName = function (name) {
        this.name = name;
        this.LOGGER.withName(this.name);
    };
    TextEditor.prototype.registerPlugin = function (plugin) {
        this.plugins.push(plugin);
    };
    TextEditor.prototype.initializeEditor = function () {
        var _this = this;
        this.editor.addEventListener("keydown", function (event) {
            event.preventDefault();
            if (ModifierMap.has(event.key)) {
                if (event.repeat)
                    return;
                _this.keyState.mods |= ModifierMap.get(event.key);
                _this.LOGGER.DEBUG(string_js_1.pp(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Mod key pressed: ", ""], ["Mod key pressed: ", ""])), event.key));
                _this.LOGGER.TRACE(string_js_1.pp(templateObject_2 || (templateObject_2 = __makeTemplateObject(["this.keyState=", ""], ["this.keyState=", ""])), _this.keyState));
                return;
            }
            var state = _this.getState();
            for (var _i = 0, _a = _this.plugins; _i < _a.length; _i++) {
                var plugin = _a[_i];
                plugin.provider.onKeyPressed(event.key, state);
            }
            _this.setState(state);
            // if (IgnoredKeys.includes(event.key)) return;
            // this.keyInput(event);
        });
        this.editor.addEventListener("keyup", function (event) {
            if (ModifierMap.has(event.key)) {
                _this.keyState.mods ^= ModifierMap.get(event.key);
                _this.LOGGER.TRACE(string_js_1.pp(templateObject_3 || (templateObject_3 = __makeTemplateObject(["this.keyState=", ""], ["this.keyState=", ""])), _this.keyState));
                return;
            }
        });
        this.editor.addEventListener("click", function (e) {
            e.preventDefault();
            _this.clampSelection();
        });
        this.registerPlugin(core_js_1.CorePlugin);
        this.LOGGER.INFO("Editor successfully initialized!");
    };
    TextEditor.prototype.clampSelection = function () {
        var _a, _b;
        var caretPos = dom_tools_js_1.getCaretSelection(this.editor);
        if (!caretPos || ((_b = (_a = this.editor.textContent) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) < 1) {
            return;
        }
        var newSelection = clampSelection(caretPos, 0, this.content.current.length);
        dom_tools_js_1.setSelection(this.editor, newSelection);
    };
    TextEditor.prototype.updateEditor = function (caret) {
        var content = conversion_js_1.stringToHTML(this.content.current);
        this.editor.innerHTML = content;
        this.LOGGER.TRACE(string_js_1.pp(templateObject_4 || (templateObject_4 = __makeTemplateObject(["New innerHTML content: \"", "\""], ["New innerHTML content: \"", "\""])), content));
        if (caret)
            dom_tools_js_1.setSelection(this.editor, clampSelection(caret, 0, this.content.current.length));
    };
    TextEditor.prototype.getState = function () {
        var selection = dom_tools_js_1.getCaretSelection(this.editor);
        if (!selection)
            this.LOGGER.WARN("Selection was null when attempting to get state.");
        return new plugin_js_1.EditorState(this.content.current, selection);
    };
    TextEditor.prototype.setState = function (state) {
        this.content.current = state.content;
        this.updateEditor(state.selection);
    };
    return TextEditor;
}());
exports.TextEditor = TextEditor;
function clampSelection(selection, min, max) {
    return {
        start: general_js_1.clamp(min, max, selection.start),
        end: general_js_1.clamp(min, max, selection.end),
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
