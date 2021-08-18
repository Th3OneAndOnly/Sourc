"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDifferences = exports.findDifferences = exports.isCaretFlat = exports.DifferenceType = void 0;
var DifferenceType;
(function (DifferenceType) {
    DifferenceType[DifferenceType["ADDITION"] = 0] = "ADDITION";
    DifferenceType[DifferenceType["DELETION"] = 1] = "DELETION";
})(DifferenceType = exports.DifferenceType || (exports.DifferenceType = {}));
function isCaretFlat(caret) {
    return caret.start == caret.end;
}
exports.isCaretFlat = isCaretFlat;
function findDifferences(original, differed) {
    original = original.replace(/[^\S\n]/g, " ");
    differed = differed.replace(/[^\S\n]/g, " ");
    var difference = differed.length - original.length;
    var _a = indicesOfAlteredChars(original, differed), indexOfAlteredChar = _a[0], lengthOfAlteredChars = _a[1];
    if (indexOfAlteredChar == null)
        return [];
    if (lengthOfAlteredChars != Math.abs(difference)) {
        return [
            {
                type: DifferenceType.DELETION,
                content: original.substr(indexOfAlteredChar, lengthOfAlteredChars - difference),
                delta: indexOfAlteredChar,
            },
            {
                type: DifferenceType.ADDITION,
                content: differed.substr(indexOfAlteredChar, lengthOfAlteredChars),
                delta: indexOfAlteredChar,
            },
        ];
    }
    return [
        {
            type: difference > 0 ? DifferenceType.ADDITION : DifferenceType.DELETION,
            content: (difference > 0 ? differed : original).substr(indexOfAlteredChar, lengthOfAlteredChars),
            delta: indexOfAlteredChar,
        },
    ];
}
exports.findDifferences = findDifferences;
function indicesOfAlteredChars(original, differed) {
    var _a, _b;
    var index = 0, length = 0;
    while (index + length < original.length || index + length < differed.length) {
        if (((_a = original[index + length]) !== null && _a !== void 0 ? _a : "") !== ((_b = differed[index + length]) !== null && _b !== void 0 ? _b : "")) {
            length++;
            continue;
        }
        if (length > 0) {
            break;
        }
        index++;
    }
    if (length == 0)
        return [null, 0];
    return [index, length];
}
function applyDifferences(original, changes) {
    var output = original;
    for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
        var change = changes_1[_i];
        switch (change.type) {
            case DifferenceType.ADDITION:
                output =
                    output.slice(0, change.delta) +
                        change.content +
                        output.slice(change.delta);
                break;
            case DifferenceType.DELETION:
                output =
                    output.slice(0, change.delta) +
                        output.slice(change.delta + change.content.length);
                break;
        }
    }
    return output;
}
exports.applyDifferences = applyDifferences;
