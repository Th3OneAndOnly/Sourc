import { Logger } from "./logger.js";
import { SourcPlugin } from "./plugin.js";
export declare class TextEditor {
    private readonly editor;
    private readonly overlay?;
    private plugins;
    private keyState;
    private content;
    private name;
    LOGGER: Logger;
    private assert;
    constructor(editor: HTMLDivElement, overlay?: HTMLDivElement | undefined);
    initialize(): void;
    setName(name: string): void;
    registerPlugin(plugin: SourcPlugin): void;
    private initializeEditor;
    private clampSelection;
    private updateEditor;
    private getState;
    private setState;
}
