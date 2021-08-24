import { Logger, ConsoleLogStrategy } from "./logger.js";
import { stringToHTML } from "./tool/conversion.js";
import {
  CaretSelection,
  getCaretSelection,
  setSelection,
} from "./tool/dom-tools.js";
import { clamp, partial } from "./tool/general.js";
import { assertWithLogger } from "./tool/assert.js";
import { EditorState, SourcPlugin } from "./plugin.js";
import { pp } from "./tool/string.js";
import { CorePlugin } from "./core.js";

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

export class TextEditor {
  private plugins: SourcPlugin[] = [];
  private keyState: KeyState = { mods: Modifiers.NONE };
  private content: EditorContent = { current: "", previous: "" };

  private name: string = "Sourc Editor <unknown>";
  public LOGGER: Logger = new Logger()
    .withName(this.name)
    .withStrategy(ConsoleLogStrategy)
    .disableTrace()
    .disableDebug();

  private assert = partial(assertWithLogger, this.LOGGER);

  constructor(
    private readonly editor: HTMLDivElement,
    private readonly overlay?: HTMLDivElement
  ) {}

  public initialize() {
    this.editor.contentEditable = "false";
    this.initializeEditor();
    this.editor.contentEditable = "true";
  }

  public setName(name: string) {
    this.name = name;
    this.LOGGER.withName(this.name);
  }

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

    this.editor.addEventListener("click", (e) => {
      e.preventDefault();
      this.clampSelection();
    });

    this.registerPlugin(CorePlugin);

    this.LOGGER.INFO("Editor successfully initialized!");
  }
  private clampSelection() {
    const caretPos = getCaretSelection(this.editor);
    if (!caretPos || (this.editor.textContent?.length ?? 0) < 1) {
      return;
    }
    let newSelection = clampSelection(caretPos, 0, this.content.current.length);
    setSelection(this.editor, newSelection);
  }

  private updateEditor(caret: CaretSelection | null) {
    const content = stringToHTML(this.content.current);
    this.editor.innerHTML = content;
    this.LOGGER.TRACE(pp`New innerHTML content: "${content}"`);
    if (caret)
      setSelection(
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

function clampSelection(
  selection: CaretSelection,
  min: number,
  max: number
): CaretSelection {
  return {
    start: clamp(min, max, selection.start),
    end: clamp(min, max, selection.end),
  };
}
