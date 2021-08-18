import { PLUGIN_LOGGER } from "./private-loggers.js";
import { CaretSelection } from "./tool/dom-tools.js";
import { pp } from "./tool/string.js";

export class EditorState {
  constructor(
    private _content: string,
    private _selection: CaretSelection | null
  ) {}

  public get content(): string {
    return this._content;
  }

  public get selection(): CaretSelection | null {
    return this._selection;
  }

  public insertText(text: string, position: number) {
    if (position < 0 || position > this._content.length) {
      PLUGIN_LOGGER.ERROR(pp`Cannot insert text at position ${position}`);
      return;
    }
    let old = this._content;
    this._content = old.slice(0, position) + text + old.slice(position);
  }

  public deleteText(position: number, length: number) {
    if (position < 0 || position > this._content.length) {
      PLUGIN_LOGGER.ERROR(pp`Cannot delete text at position ${position}`);
      return;
    }

    if (position + length < 0 || position + length > this._content.length) {
      PLUGIN_LOGGER.ERROR(pp`Cannot delete text of length ${length}`);
      return;
    }

    let old = this._content;
    this._content = old.slice(0, position) + old.slice(position + length);
  }

  public setSelection(selection: CaretSelection) {
    this._selection = selection;
  }
}

export abstract class PluginProvider {
  public onKeyPressed(key: string, state: EditorState) {}
}

export class PluginConfig {
  constructor({}) {}
}

export class SourcPlugin {
  constructor(
    public readonly provider: PluginProvider,
    public readonly config: PluginConfig
  ) {}
}
