import { assert } from '../../tool/assert';
import { CORE_LOGGER } from '../../private-loggers';
import {
  DeleteText,
  InsertText,
  SetSelection,
  StateChange
  } from '../../state';
import { EditorState, ListOfProviders, PluginProvider } from '../../plugin';
import { findLineOf, findLineOffset, pp } from '../../tool/string';
import { FunctionDispatcher, nullCall } from '../../tool/general';
import { KeyState } from '../../editor';
import { Logger, LoggerPool } from '../../logger';
import {
  getKeyType,
  getSelectionLength,
  isSelectionFlat,
  KeyType,
} from "../../tool/dom-tools";

const SpecialKeys = Object.freeze(
  new Map(
    Object.entries({
      Enter: "\n",
    })
  )
);

const IgnoredKeys = Object.freeze(["Meta"]);

type TextDispatcher = FunctionDispatcher<
  [string, EditorState, number],
  StateChange[]
>;
const TextDispatcher = (): TextDispatcher => {
  return FunctionDispatcher.create<
    [string, EditorState, number],
    StateChange[]
  >();
};

class PluginKeyHelper extends PluginProvider {
  protected constructor(
    private _dispatcherCB: (
      fb: TextDispatcher,
      key: string,
      state: EditorState
    ) => void
  ) {
    super();
  }
  override async onKeyPressed(
    key: string,
    state: EditorState
  ): Promise<StateChange[]> {
    const dispatcher = TextDispatcher();
    this._dispatcherCB(dispatcher, key, state);
    return dispatcher.try(key, state, state.selection?.start ?? -1).flat();
  }
}

class TextInsertionPlugin extends PluginKeyHelper {
  public static LOGGER: Logger = new Logger();

  constructor() {
    super((dp, key, state) => {
      key = SpecialKeys.get(key) ?? key;
      dp.require(this.isKeyValid(key)).if(
        nullCall(isSelectionFlat, state.selection) ?? false,
        (_, state, location) => this.flatAnyKey.bind(this)(key, state, location)
      );
    });
  }

  private isKeyValid(key: string): boolean {
    return getKeyType(key) == KeyType.Other;
  }

  public flatAnyKey(
    key: string,
    _state: EditorState,
    location: number
  ): StateChange[] {
    return [
      new InsertText(key, location),
      new SetSelection({ start: location + 1, end: location + 1 }),
    ];
  }
}

class TextDeletionPlugin extends PluginKeyHelper {
  constructor() {
    super((dp, key, state) => {
      const type = getKeyType(key);
      dp.if(type == KeyType.Backspace, this.flatBackspaceKey.bind(this)).if(
        type == KeyType.Delete,
        this.flatDeleteKey.bind(this)
      );
    });
  }

  private flatDeleteKey(
    _key: string,
    state: EditorState,
    location: number
  ): StateChange[] {
    if (location >= state.content.length) return [];
    assert(
      CORE_LOGGER,
      state.selection != null,
      "State selection was null when deleting!"
    );
    if (isSelectionFlat(state.selection))
      return [
        new DeleteText(location, 1),
        new SetSelection({ start: location + 1, end: location + 1 }),
      ];
    return [
      new DeleteText(location, 1),
      new SetSelection({ start: location, end: location }),
    ];
  }

  private flatBackspaceKey(
    _key: string,
    state: EditorState,
    location: number
  ): StateChange[] {
    if (location <= 0) return [];
    assert(
      CORE_LOGGER,
      state.selection != null,
      "State selection was null when deleting!"
    );
    if (isSelectionFlat(state.selection))
      return [
        new DeleteText(location - 1, 1),
        new SetSelection({ start: location - 1, end: location - 1 }),
      ];

    return [
      new DeleteText(location, getSelectionLength(state.selection)),
      new SetSelection({ start: location, end: location }),
    ];
  }
}

class ArrowKeyPlugin extends PluginKeyHelper {
  constructor() {
    super((dp, key, state) => {
      const type = getKeyType(key);
      dp.require(type == KeyType.ArrowKey)
        .if(key == "ArrowUp", (_, state) =>
          this.handleUpArrow.bind(this)(state)
        )
        .if(key == "ArrowDown", (_, state) =>
          this.handleDownArrow.bind(this)(state)
        )
        .if(key == "ArrowLeft", (_, state) =>
          this.handleLeftArrow.bind(this)(state)
        )
        .if(key == "ArrowRight", (_, state) =>
          this.handleRightArrow.bind(this)(state)
        );
    });
  }

  private handleDownArrow(state: EditorState): StateChange[] {
    const pos = state.selection!.end;
    const lines = state.content.split("\n");
    const lineNum = findLineOf(state.content, pos);
    const lineOffset = findLineOffset(state.content, pos);
    const lineLength = lines[lineNum]?.length + 1;
    const nextLineLength = CORE_LOGGER.TRACK(
      lines[lineNum + 1]?.length,
      "(DownArrow) Next Line Length"
    );
    const restOfLine = lineLength - lineOffset;
    let offset = lineLength;
    if (lineOffset > nextLineLength) {
      offset = restOfLine + nextLineLength;
    }
    const caret = pos + offset;
    return [new SetSelection({ start: caret, end: caret })];
  }

  private handleUpArrow(state: EditorState): StateChange[] {
    const caretPos = state.selection!.start;
    const lines = state.content.split("\n");
    const lineNum = findLineOf(state.content, caretPos);
    const prevLineLength = CORE_LOGGER.TRACK(
      lines[lineNum - 1]?.length,
      "(UpArrow) Previous Line Length"
    );
    const caretLineOffset = findLineOffset(state.content, caretPos);
    let offset = prevLineLength + 1;
    if (caretLineOffset > prevLineLength) {
      offset = caretLineOffset + 1;
    }
    const caret = caretPos - offset;
    return [new SetSelection({ start: caret, end: caret })];
  }

  private handleLeftArrow(state: EditorState): StateChange[] {
    const caret = state.selection!.start - 1;
    return [new SetSelection({ start: caret, end: caret })];
  }

  private handleRightArrow(state: EditorState): StateChange[] {
    const caret = state.selection!.end + 1;
    return [new SetSelection({ start: caret, end: caret })];
  }
}

export const CorePlugin = new ListOfProviders([
  new TextInsertionPlugin(),
  new TextDeletionPlugin(),
  new ArrowKeyPlugin(),
]);

const LOGGER_MAP = {
  TEXT_INSERTION: TextInsertionPlugin.LOGGER,
} as const;

export const LOGGERS = new LoggerPool(LOGGER_MAP);
