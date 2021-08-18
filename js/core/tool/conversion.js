"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToHTML = void 0;
function stringToHTML(input) {
    var output = "";
    for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var char = input_1[_i];
        switch (char) {
            default:
                output += char;
        }
    }
    return output + "\n\n";
}
exports.stringToHTML = stringToHTML;
