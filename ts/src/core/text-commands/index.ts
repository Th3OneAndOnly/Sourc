import { CORE_LOGGER } from '../../private-loggers';
import {
  DeleteText,
  InsertText,
  SetSelection,
  StateChange
  } from '../../state';
import { findLineOffset, pp } from '../../tool/string';
import { FunctionDispatcher } from '../../tool/general';
import { getKeyType, isSelectionFlat, KeyType } from '../../tool/dom-tools';
import {
  PluginProvider,
  EditorState,
  SourcPlugin,
  PluginConfig,
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

class CorePluginProvider extends PluginProvider {
  override async onKeyPressed(
    key: string,
    state: EditorState
  ): Promise<StateChange[]> {
    key = SpecialKeys.get(key) ?? key;
    const type = getKeyType(key);

    return new FunctionDispatcher<
      [string, EditorState, KeyType],
      StateChange[]
    >()
      .require(state.selection != null, () =>
        CORE_LOGGER.ERROR("Key was pressed, but couldn't find the caret!")
      )
      .require(!IgnoredKeys.includes(key))
      .runOne()
      .if(type == KeyType.ArrowKey, this.handleArrowKey.bind(this))
      .if(isSelectionFlat(state.selection!), this.handleFlatCaret.bind(this))
      .try(key, state, type)
      .flat();
  }

  private handleFlatCaret(
    key: string,
    state: EditorState,
    type: KeyType
  ): StateChange[] {
    const location = state.selection!.start;
    return new FunctionDispatcher<
      [string, EditorState, number],
      StateChange[]
    >()
      .runOne()
      .if(type == KeyType.Backspace, this.handleFlatBackspace.bind(this))
      .if(type == KeyType.Delete, this.handleFlatDelete.bind(this))
      .if(true, this.handleFlatKeyInsert.bind(this))
      .try(key, state, location)
      .flat();
  }

  private handleFlatKeyInsert(
    key: string,
    _state: EditorState,
    location: number
  ): StateChange[] {
    return [
      new InsertText(key, location),
      new SetSelection({ start: location + 1, end: location + 1 }),
    ];
  }

  private handleFlatDelete(
    _key: string,
    state: EditorState,
    location: number
  ): StateChange[] {
    if (location >= state.content.length) return [];
    return [new DeleteText(location, 1)];
  }

  private handleFlatBackspace(
    _key: string,
    state: EditorState,
    location: number
  ): StateChange[] {
    return [
      new DeleteText(location - 1, 1),
      new SetSelection({ start: location - 1, end: location - 1 }),
    ];
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

export const CorePlugin = new ListOfProviders([new CorePluginProvider()]);
