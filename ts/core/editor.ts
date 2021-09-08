import { assertWithLogger } from './tool/assert';
import { clamp, partial } from './tool/general';
import { ConsoleLogStrategy, Logger } from './logger';
import { CorePlugin } from './core';
import { EditorState, SourcPlugin } from './plugin';
import { pp } from './tool/string';
import { stringToHTML } from './tool/conversion';
import {
  CaretSelection,
  clampSelection,
  getCaretSelection,
  setCaretSelection,
} from "./tool/dom-tools";

enum Modifiers {
  NONE = 1 << 0,
  SHIFT = 1 << 1,
  ALT = 1 << 2,
  CTRL = 1 << 3,
}

const ModifierMap = Object.freeze(
  new Map(
    Object.entries({
      Shift: Modifiers.SHIFT,
      Alt: Modifiers.ALT,
      Control: Modifiers.CTRL,
    })
  )
);

type KeyState = { mods: Modifiers };

type EditorContent = { current: string; previous: string };

/**
 * The heart and soul of Sourc. The TextEditor class
 * is the gateway into your application. Begin by creating one,
 * making sure to have any sort of HTMLElement ready:
 * ```typescript
 * let editor = new TextEditor(element);
 * ```
 * You can access the {@link TextEditor.LOGGER} to enable or
 * disable anything you want there now.
 *
 * Next add any plugins you want to it (the core one is already loaded):
 * ```typescript
 * editor.registerPlugin(myPlugin);
 * ```
 * See {@link SourcPlugin} for more info on creating plugins.
 *
 * Now initialize the editor:
 * ```typescript
 * editor.initialize();
 * ```
 * The element will become content-editable, and becomes a Sourc editor!
 */
export class TextEditor {
  private plugins: SourcPlugin[] = [];
  private keyState: KeyState = { mods: Modifiers.NONE };
  private content: EditorContent = { current: "", previous: "" };

  /**
   * Publicly accessible logger for the text editor.
   * See {@link Logger}
   */
  public LOGGER: Logger = new Logger()
    .withName("Sourc Editor <unknown>")
    .withStrategy(ConsoleLogStrategy)
    .disableTrace()
    .disableDebug();

  private assert = partial(assertWithLogger, this.LOGGER);

  /**
   * Creates an instance of text editor.
   * @param editor The element the editor will use to run.
   */
  constructor(private readonly editor: HTMLDivElement) {
    this.registerPlugin(CorePlugin);
  }

  /**
   * Initializes the editor and all registered plugins.
   */
  public initialize() {
    this.editor.contentEditable = "false";
    this.initializeEditor();
    this.editor.contentEditable = "true";
  }

  /**
   * Registers a plugin into the editor
   */
  public registerPlugin(plugin: SourcPlugin) {
    this.plugins.push(plugin);
  }

  private initializeEditor() {
    this.editor.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (ModifierMap.has(event.key)) {
        if (event.repeat) return;
        this.keyState.mods |= ModifierMap.get(event.key)!;
        this.LOGGER.DEBUG(pp`Mod key pressed: ${event.key}`);
        this.LOGGER.TRACE(pp`this.keyState=${this.keyState}`);
        return;
      }

      let state = this.getState();
      for (let plugin of this.plugins) {
        plugin.provider.onKeyPressed(event.key, state);
      }
      this.setState(state);
    });

    this.editor.addEventListener("keyup", (event) => {
      if (ModifierMap.has(event.key)) {
        this.keyState.mods ^= ModifierMap.get(event.key)!;
        this.LOGGER.TRACE(pp`this.keyState=${this.keyState}`);
        return;
      }
    });

    this.tickLoop();
    this.LOGGER.INFO("Editor successfully initialized!");
  }

  private tickLoop() {
    // this.setState(new EditorState("Hello World!", { start: 5, end: 0 }));
    this.clampSelection();
    requestAnimationFrame(this.tickLoop.bind(this));
  }

  private clampSelection() {
    // TODO: fix backwards selection not working
    const caretPos = getCaretSelection(this.editor);
    if (!caretPos || (this.editor.textContent?.length ?? 0) < 1) {
      return;
    }
    let newSelection = clampSelection(caretPos, 0, this.content.current.length);
    setCaretSelection(this.editor, newSelection);
  }

  private updateEditor(caret: CaretSelection | null) {
    const content = stringToHTML(this.content.current);
    this.editor.innerHTML = content;
    this.LOGGER.TRACE(pp`New innerHTML content: "${content}"`);
    if (caret)
      setCaretSelection(
        this.editor,
        clampSelection(caret, 0, this.content.current.length)
      );
  }

  private getState(): EditorState {
    const selection = getCaretSelection(this.editor);
    if (!selection)
      this.LOGGER.WARN("Selection was null when attempting to get state.");
    return new EditorState(this.content.current, selection);
  }

  private setState(state: EditorState) {
    this.content.current = state.content;
    this.updateEditor(state.selection);
  }
}
