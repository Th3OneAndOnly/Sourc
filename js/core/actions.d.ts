import { Action } from "./action.js";
import { CaretSelection } from "./tool/dom-tools.js";
export declare class BlankAction extends Action {
    getNewSelection(_input: string): CaretSelection;
    outputText(input: string): string;
}
export declare class InsertText extends Action {
    private text;
    private position;
    constructor(text: string, position: number);
    getNewSelection(_input: string): CaretSelection;
    outputText(input: string): string;
}
export declare class DeleteText extends Action {
    private start;
    private length;
    constructor(start: number, length: number);
    getNewSelection(_input: string): CaretSelection;
    outputText(input: string): string;
}
export declare class MoveCaret extends Action {
    private position;
    constructor(position: CaretSelection);
    getNewSelection(input: string): CaretSelection;
    outputText(input: string): string;
}
