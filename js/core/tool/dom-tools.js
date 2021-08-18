"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaretSelection = exports.setSelection = exports.htmlToString = exports.getKeyType = exports.KeyType = void 0;
var private_loggers_js_1 = require("../private-loggers.js");
var assert_js_1 = require("./assert.js");
var KeyType;
(function (KeyType) {
    KeyType[KeyType["Backspace"] = 0] = "Backspace";
    KeyType[KeyType["Delete"] = 1] = "Delete";
    KeyType[KeyType["ArrowKey"] = 2] = "ArrowKey";
    KeyType[KeyType["Modifier"] = 3] = "Modifier";
    KeyType[KeyType["Alphanumeric"] = 4] = "Alphanumeric";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
function getKeyType(key) {
    switch (key) {
        case "Backspace":
            return KeyType.Backspace;
        case "Delete":
            return KeyType.Delete;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
            return KeyType.ArrowKey;
        case "Shift":
        case "Control":
        case "Alt":
        case "Super":
            return KeyType.Modifier;
        default:
            return KeyType.Alphanumeric;
    }
}
exports.getKeyType = getKeyType;
function htmlToString(html) {
    var output = "";
    var inTagName = false;
    var currentTag = "";
    for (var _i = 0, html_1 = html; _i < html_1.length; _i++) {
        var char = html_1[_i];
        if (!inTagName) {
            if (char == "<") {
                inTagName = true;
                currentTag = "";
                continue;
            }
            output += char;
        }
    }
    return output;
}
exports.htmlToString = htmlToString;
function setSelection(element, selection) {
    var sel = window.getSelection();
    if (sel == null)
        return;
    var range = createRange(element, selection.start)[0];
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}
exports.setSelection = setSelection;
function createRange(node, offset, range) {
    if (!range) {
        range = document.createRange();
        range.selectNode(node);
        range.setStart(node, 0);
    }
    var _a = findOffsetIntoNode(node, private_loggers_js_1.DOM_TOOLS_LOGGER.TRACK(offset, "offset")), child = _a[0], front = _a[1];
    assert_js_1.assert(private_loggers_js_1.DOM_TOOLS_LOGGER, child != null, "Child was null!");
    range.setEnd(child, front);
    return [range, offset];
}
function findOffsetIntoNode(parent, offset) {
    var _a;
    if (parent.nodeType == Node.TEXT_NODE || parent.nodeName == "BR") {
        var content = parent.nodeName == "BR" ? "\n" : (_a = parent.textContent) !== null && _a !== void 0 ? _a : "";
        if (content.length < offset) {
            offset -= content.length;
            return [null, offset];
        }
        else {
            return [parent, parent.nodeName == "BR" ? offset - 1 : offset];
        }
    }
    else {
        for (var i = 0; i < parent.childNodes.length; i++) {
            var _b = findOffsetIntoNode(parent.childNodes[i], offset), node = _b[0], newOffset = _b[1];
            if (!node) {
                offset = newOffset;
            }
            else {
                return [node, newOffset];
            }
        }
        return [null, offset];
    }
}
function getCaretSelection(element) {
    var selection = window.getSelection();
    if (element && selection && selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        return {
            start: getTextLength(element, range.startContainer, range.startOffset),
            end: getTextLength(element, range.endContainer, range.endOffset),
        };
    }
    return null;
}
exports.getCaretSelection = getCaretSelection;
function getTextLength(element, node, offset) {
    var output = 0;
    if (node.nodeType == Node.TEXT_NODE) {
        output += offset;
    }
    else {
        for (var i = 0; i < offset; i++) {
            output += getNodeTextLength(node.childNodes[i]);
        }
    }
    if (node != element && node.parentNode) {
        output += getTextLength(element, node.parentNode, getNodeOffset(node));
    }
    return output;
}
function getNodeTextLength(node) {
    var _a;
    var output = 0;
    if (node.nodeName == "BR") {
        output += 1;
    }
    else if (node.nodeType == Node.TEXT_NODE) {
        output += ((_a = node.nodeValue) !== null && _a !== void 0 ? _a : "").length;
    }
    else if (node.childNodes != null) {
        node.childNodes.forEach(function (child) { return (output += getNodeTextLength(child)); });
    }
    return output;
}
function getNodeOffset(node) {
    return node == null ? -1 : 1 + getNodeOffset(node.previousSibling);
}
