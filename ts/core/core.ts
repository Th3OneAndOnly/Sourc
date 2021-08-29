import { CORE_LOGGER } from './private-loggers';
import { findLineOffset, pp } from './tool/string';
import { getKeyType, isCaretFlat, KeyType } from './tool/dom-tools';
import { StatefulFunction } from './tool/general';
import {
  PluginProvider,
  EditorState,
  SourcPlugin,
  PluginConfig,
} from "./plugin";

const SpecialKeys = Object.freeze(
  new Map(
    Object.entries({
      Enter: "\n",
    })
  )
);

const IgnoredKeys = Object.freeze(["Meta"]);

class CorePluginProvider extends PluginProvider {
  override onKeyPressed(key: string, state: EditorState) {
    key = SpecialKeys.get(key) ?? key;
    const type = getKeyType(key);

    new StatefulFunction<[string, EditorState, KeyType]>()
      .require(state.selection != null, () =>
        CORE_LOGGER.ERROR("Key was pressed, but couldn't find the caret!")
      )
      .require(!IgnoredKeys.includes(key))
      .runOne()
      .if(type == KeyType.ArrowKey, this.handleArrowKey.bind(this))
      .if(isCaretFlat(state.selection!), this.handleFlatCaret.bind(this))
      .try(key, state, type);
  }

  private handleFlatCaret(key: string, state: EditorState, type: KeyType) {
    const location = state.selection!.start;
    new StatefulFunction<[string, EditorState, number]>()
      .runOne()
      .if(type == KeyType.Backspace, this.handleFlatBackspace.bind(this))
      .if(type == KeyType.Delete, this.handleFlatDelete.bind(this))
      .if(true, this.handleFlatKeyInsert.bind(this))
      .try(key, state, location);
  }

  private handleFlatKeyInsert(
    key: string,
    state: EditorState,
    location: number
  ) {
    state.insertText(key, location);
    state.setSelection({
      start: location + 1,
      end: location + 1,
    });
  }

  private handleFlatDelete(_key: string, state: EditorState, location: number) {
    if (location >= state.content.length) return;
    state.deleteText(location, 1);
  }

  private handleFlatBackspace(
    _key: string,
    state: EditorState,
    location: number
  ) {
    state.deleteText(location - 1, 1);
    state.setSelection({
      start: location - 1,
      end: location - 1,
    });
  }

  private handleArrowKey(key: string, state: EditorState) {
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
    state.setSelection({
      start: caret,
      end: caret,
    });
  }
}

export const CorePlugin = new SourcPlugin(
  new CorePluginProvider(),
  new PluginConfig({})
);
