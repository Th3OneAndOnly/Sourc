import { CaretSelection } from "./dom-tools.js";
export declare enum DifferenceType {
    ADDITION = 0,
    DELETION = 1
}
export declare type TextDifference = {
    type: DifferenceType;
    content: string;
    delta: number;
};
export declare function isCaretFlat(caret: CaretSelection): boolean;
export declare function findDifferences(original: string, differed: string): TextDifference[];
export declare function applyDifferences(original: string, changes: TextDifference[]): string;
