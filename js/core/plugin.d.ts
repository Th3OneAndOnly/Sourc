import { CaretSelection } from "./tool/dom-tools.js";
export declare class EditorState {
    private _content;
    private _selection;
    constructor(_content: string, _selection: CaretSelection | null);
    get content(): string;
    get selection(): CaretSelection | null;
    insertText(text: string, position: number): void;
    deleteText(position: number, length: number): void;
    setSelection(selection: CaretSelection): void;
}
export declare abstract class PluginProvider {
    onKeyPressed(key: string, state: EditorState): void;
}
export declare class PluginConfig {
    constructor({}: {});
}
export declare class SourcPlugin {
    readonly provider: PluginProvider;
    readonly config: PluginConfig;
    constructor(provider: PluginProvider, config: PluginConfig);
}
