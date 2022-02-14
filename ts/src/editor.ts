import { assertWithLogger } from './tool/assert';
import { clamp, partial } from './tool/general';
import { ConsoleLogHandler, Logger } from './logger';
import { CorePlugin } from './core/text-commands';
import { pp } from './tool/string';
import { StateChange } from './state';
import { stringToHTML } from './tool/conversion';
import {
  EditorState,
  SourcPlugin,
  PluginConfig,
  PluginSettings,
} from "./plugin";
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
  private _plugins: SourcPlugin[] = [];
  private _keyState: KeyState = { mods: Modifiers.NONE };
  private _content: EditorContent = { current: "", previous: "" };

  /**
   * Publicly accessible logger for the text editor.
   * See {@link Logger}
   */
  public LOGGER: Logger = new Logger()
    .withName("Sourc Editor <unknown>")
    .withHandler(ConsoleLogHandler)
    .disableTrace()
    .disableDebug();

  private assert = partial(assertWithLogger, this.LOGGER);

  /**
   * Creates an instance of text editor.
   * @param editor The element the editor will use to run.
   */
  constructor(
    private readonly editor: HTMLElement,
    config: PluginSettings = {}
  ) {
    const core = new SourcPlugin(CorePlugin, new PluginConfig(config));
    this.registerPlugin(core);
  }

  /**
   * Initializes the editor and all registered plugins.
   */
  public initialize() {
    this.editor.contentEditable = "false";
    this.initializeEditor();

    for (const plugin of this._plugins) {
      plugin.provider.onInitialize();
    }

    this.editor.contentEditable = "true";
  }

  /**
   * Registers a plugin into the editor
   */
  public registerPlugin(plugin: SourcPlugin) {
    this._plugins.push(plugin);
  }

  private initializeEditor() {
    this.editor.addEventListener("keydown", this.handleKeyDown.bind(this));

    this.editor.addEventListener("keyup", this.handleKeyUp.bind(this));

    this.tickLoop();
    this.LOGGER.INFO("Editor successfully initialized!");
  }

  private handleKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    if (ModifierMap.has(event.key)) {
      if (event.repeat) return;
      this._keyState.mods |= ModifierMap.get(event.key)!;
      this.LOGGER.DEBUG(pp`Mod key pressed: ${event.key}`);
      this.LOGGER.TRACE(pp`this.keyState=${this._keyState}`);
      return;
    }

    const state = this.getState();

    let allPresses: Promise<StateChange[]>[] = [];
    for (let plugin of this._plugins) {
      allPresses.push(plugin.provider.onKeyPressed(event.key, state));
    }
    Promise.all(allPresses).then((states) => {
      let resolvedStates = this.resolveStateChanges(states.flat());
      for (const resolvedState of resolvedStates) {
        this.setState(resolvedState.transformState(this.getState()));
      }
    });
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (ModifierMap.has(event.key)) {
      this._keyState.mods ^= ModifierMap.get(event.key)!;
      this.LOGGER.TRACE(pp`this.keyState=${this._keyState}`);
      return;
    }
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
    let newSelection = clampSelection(
      caretPos,
      0,
      this._content.current.length
    );
    setCaretSelection(this.editor, newSelection);
  }

  private updateEditor(caret: CaretSelection | null) {
    const content = stringToHTML(this._content.current);
    this.editor.innerHTML = content;
    this.LOGGER.TRACE(pp`New innerHTML content: "${content}"`);
    if (caret)
      setCaretSelection(
        this.editor,
        clampSelection(caret, 0, this._content.current.length)
      );
  }

  private resolveStateChanges(changes: StateChange[]): StateChange[] {
    const out: StateChange[] = [];
    for (const change of changes) {
      let matched = false;
      for (const existing of out) {
        if (existing.isIdenticalTo(change)) matched = true;
      }
      if (!matched) out.push(change);
    }
    return out;
  }

  private getState(): EditorState {
    const selection = getCaretSelection(this.editor);
    if (!selection)
      this.LOGGER.WARN("Selection was null when attempting to get state.");
    return new EditorState(this._content.current, selection);
  }

  private setState(state: EditorState) {
    this._content.current = state.content;
    this.updateEditor(state.selection);
  }
}
