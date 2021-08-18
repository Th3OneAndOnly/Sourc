"use strict";
///////////////////
// STRING FORMAT //
///////////////////
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLineOffset = exports.pp = void 0;
function pp(strings) {
    var objs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objs[_i - 1] = arguments[_i];
    }
    return strings.reduce(function (prev, cur, idx) {
        var obj = "";
        if (idx < objs.length)
            obj = unknownToString(objs[idx]);
        return prev + cur + obj;
    }, "");
}
exports.pp = pp;
function unknownToString(obj) {
    if (typeof obj === "object")
        return objectToString(obj);
    else
        return valueToString(obj, 0);
}
function objectToString(obj) {
    return "\n" + prettyObjectToString(obj, 0);
}
function prettyObjectToString(obj, indentLevel) {
    if (obj == null)
        return "null";
    var name = obj.constructor.name;
    var out = "" + getIndent(indentLevel);
    if (name != "Object")
        out += "(" + name + ")";
    out += "{\n";
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], name_1 = _b[0], value = _b[1];
        out += "" + getIndent(indentLevel + 1) + name_1 + ": " + valueToString(value, indentLevel + 1) + "\n";
    }
    out += getIndent(indentLevel) + "}";
    return out;
}
function getIndent(level) {
    return "" + " ".repeat(level);
}
function never(param) {
    throw new Error("Unreachable!");
}
function valueToString(value, indentLevel) {
    if (value == null)
        return "null";
    var type = typeof value;
    switch (type) {
        case "undefined":
            return "undefined";
        case "string":
            return "\"" + value + "\"";
        case "bigint":
        case "number":
            return value.toString();
        case "boolean":
            return value ? "true" : "false";
        case "symbol":
            return value.toString();
        case "function":
            var func = value;
            return func.name.length > 0
                ? "<function " + func.name + ">"
                : "<anonymous function>";
        case "object":
            return "\n" + prettyObjectToString(value, indentLevel + 1);
        default:
            return never(type);
    }
}
///////////////////////
// STRING OPERATIONS //
///////////////////////
function findLineOffset(string, index) {
    var lineNumber = string
        .split("") // To array, needed for .filter
        .slice(0, index)
        .filter(function (ch) { return ch == "\n"; }).length;
    var previousLinesLength = string
        .split("\n")
        .slice(0, lineNumber)
        .reduce(function (length, line) { return length + line.length + 1; }, 0);
    // const previousLineLength = string.split("\n")[lineNumber - 1]?.length + 1;
    // + 1 for \n
    return index - previousLinesLength;
}
exports.findLineOffset = findLineOffset;
