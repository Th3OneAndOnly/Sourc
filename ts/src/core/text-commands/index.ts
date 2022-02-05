import { CORE_LOGGER } from '../../private-loggers';
import {
  DeleteText,
  InsertText,
  SetSelection,
  StateChange
  } from '../../state';
import { findLineOffset, pp } from '../../tool/string';
import { FunctionDispatcher, nullCall } from '../../tool/general';
import { getKeyType, isSelectionFlat, KeyType } from '../../tool/dom-tools';
import { Logger, LoggerPool } from '../../logger';
import {
  PluginProvider,
  EditorState,
  ListOfProviders,
} from "../../plugin";

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
      dp
      .require(this.isKeyValid(key))
      .if(
        nullCall(isSelectionFlat, state.selection) ?? false,
        this.flatAnyKey.bind(this)
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
      const type = getKeyType(key)
      dp
        .if(type == KeyType.Backspace, this.flatBackspaceKey.bind(this))
        .if(type == KeyType.Delete, this.flatDeleteKey.bind(this))
    });
  }
  private flatDeleteKey(
    _key: string,
    state: EditorState,
    location: number
  ): StateChange[] {
    if (location >= state.content.length) return [];
    return [new DeleteText(location, 1)];
  }

  private flatBackspaceKey(
    _key: string,
    state: EditorState,
    location: number
  ): StateChange[] {
    return [
      new DeleteText(location - 1, 1),
      new SetSelection({ start: location - 1, end: location - 1 }),
    ];
  }
}

class TextCommandsPluginProvider extends PluginProvider {
  override async onKeyPressed(
    key: string,
    state: EditorState
  ): Promise<StateChange[]> {
    key = SpecialKeys.get(key) ?? key;
    const type = getKeyType(key);

    return FunctionDispatcher.create<
      [string, EditorState, KeyType],
      StateChange[]
    >()
      .require(state.selection != null, () =>
        CORE_LOGGER.ERROR("Key was pressed, but couldn't find the caret!")
      )
      .require(!IgnoredKeys.includes(key))
      .runOne()
      .if(type == KeyType.ArrowKey, this.handleArrowKey.bind(this))
      .try(key, state, type)
      .flat();
  }
  
  private handleArrowKey(key: string, state: EditorState): StateChange[] {
    let caret = 0;
    switch (key) {
      case "ArrowUp": {
        const pos = state.selection!.start;
        const lines = state.content.split("\n");
        const lineNum =
          state.content
            .split("")
            .slice(0, pos)
            .filter((ch) => ch == "\n").length - 1;
        const lineLength = lines[lineNum]?.length + 1;
        const lineOffset = findLineOffset(state.content, pos);
        let offset: number;
        if (lineOffset >= lineLength) {
          offset = 1 + lineOffset;
        } else {
          offset = lineLength;
        }
        caret = pos - offset;
        break;
      }
      case "ArrowDown": {
        const pos = state.selection!.end;
        const lines = state.content.split("\n");
        const lineNum =
          state.content
            .split("")
            .slice(0, pos)
            .filter((ch) => ch == "\n").length + 1;
        const lineLength = lines[lineNum]?.length + 1;
        const prevLineLength = lines[lineNum - 1]?.length + 1;
        const lineOffset = findLineOffset(state.content, pos);
        let offset: number;
        if (lineOffset >= lineLength) {
          offset = lineLength + prevLineLength - lineOffset - 1;
        } else {
          offset = prevLineLength;
        }
        caret = pos + offset;
        break;
      }
      case "ArrowLeft":
        caret = state.selection!.start - 1;
        break;
      case "ArrowRight":
        caret = state.selection!.end + 1;
        break;
    }
    return [new SetSelection({ start: caret, end: caret })];
  }
}

export const CorePlugin = new ListOfProviders([
  new TextCommandsPluginProvider(),
  new TextInsertionPlugin(),
  new TextDeletionPlugin(),
]);


const LOGGER_MAP = {
  TEXT_INSERTION: TextInsertionPlugin.LOGGER,
} as const;

export const LOGGERS = new LoggerPool(LOGGER_MAP);

