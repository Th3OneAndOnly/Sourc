import { CaretSelection } from "./tool/dom-tools.js";
export declare abstract class Action {
    abstract getNewSelection(input: string): CaretSelection;
    abstract outputText(input: string): string;
}
