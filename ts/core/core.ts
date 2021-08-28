import {
  PluginProvider,
  EditorState,
  SourcPlugin,
  PluginConfig,
} from "./plugin";
import { CORE_LOGGER } from "./private-loggers";
import { getKeyType, KeyType, isCaretFlat } from "./tool/dom-tools";
import { findLineOffset, pp } from "./tool/string";

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
    if (!state.selection) {
      CORE_LOGGER.ERROR("Key was pressed, but couldn't find the caret!");
      return;
    }
    if (IgnoredKeys.includes(key)) return;
    key = SpecialKeys.get(key) ?? key;
    let type = getKeyType(key);
    if (type == KeyType.ArrowKey) {
      this.handleArrowKey(key, state);
      return;
    }
    if (isCaretFlat(state.selection)) {
      const location = state.selection.start;
      if (type == KeyType.Backspace) {
        state.deleteText(location - 1, 1);
        state.setSelection({
          start: location - 1,
          end: location - 1,
        });
      } else if (type == KeyType.Delete) {
        if (location >= state.content.length) return;
        state.deleteText(location, 1);
      } else {
        state.insertText(key, location);
        state.setSelection({
          start: location + 1,
          end: location + 1,
        });
      }
    }
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
