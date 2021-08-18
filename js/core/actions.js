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
exports.MoveCaret = exports.DeleteText = exports.InsertText = exports.BlankAction = void 0;
var action_js_1 = require("./action.js");
var BlankAction = /** @class */ (function (_super) {
    __extends(BlankAction, _super);
    function BlankAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlankAction.prototype.getNewSelection = function (_input) {
        return { start: 0, end: 0 };
    };
    BlankAction.prototype.outputText = function (input) {
        return input;
    };
    return BlankAction;
}(action_js_1.Action));
exports.BlankAction = BlankAction;
var InsertText = /** @class */ (function (_super) {
    __extends(InsertText, _super);
    function InsertText(text, position) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.position = position;
        return _this;
    }
    InsertText.prototype.getNewSelection = function (_input) {
        return { start: this.position + 1, end: this.position + 1 };
    };
    InsertText.prototype.outputText = function (input) {
        return (input.slice(0, this.position) + this.text + input.slice(this.position));
    };
    return InsertText;
}(action_js_1.Action));
exports.InsertText = InsertText;
var DeleteText = /** @class */ (function (_super) {
    __extends(DeleteText, _super);
    function DeleteText(start, length) {
        var _this = _super.call(this) || this;
        _this.start = start;
        _this.length = length;
        return _this;
    }
    DeleteText.prototype.getNewSelection = function (_input) {
        return { start: this.start, end: this.start };
    };
    DeleteText.prototype.outputText = function (input) {
        return input.slice(0, this.start) + input.slice(this.start + this.length);
    };
    return DeleteText;
}(action_js_1.Action));
exports.DeleteText = DeleteText;
var MoveCaret = /** @class */ (function (_super) {
    __extends(MoveCaret, _super);
    function MoveCaret(position) {
        var _this = _super.call(this) || this;
        _this.position = position;
        return _this;
    }
    MoveCaret.prototype.getNewSelection = function (input) {
        return {
            start: this.position.start,
            end: this.position.start,
        };
    };
    MoveCaret.prototype.outputText = function (input) {
        return input;
    };
    return MoveCaret;
}(action_js_1.Action));
exports.MoveCaret = MoveCaret;
