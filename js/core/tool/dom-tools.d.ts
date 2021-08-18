export declare type CaretSelection = {
    start: number;
    end: number;
};
export declare enum KeyType {
    Backspace = 0,
    Delete = 1,
    ArrowKey = 2,
    Modifier = 3,
    Alphanumeric = 4
}
export declare function getKeyType(key: string): KeyType;
export declare function htmlToString(html: string): string;
export declare function setSelection(element: HTMLElement, selection: CaretSelection): void;
export declare function getCaretSelection(element: (Node & ParentNode) | null): CaretSelection | null;
