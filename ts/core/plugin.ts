import { CaretSelection } from './tool/dom-tools';
import { PLUGIN_LOGGER } from './private-loggers';
import { pp } from './tool/string';

/**
 * Contains mutable state for the editor.
 * It is passed around plugins and mutated to edit the editor state.
 */
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

  /**
   * Inserts text at a specified position.
   * Ex.:
   * ```typescript
   * state.content; // "Hello World!"
   * state.insertText("Wonderful ", 6);
   * state.content; // "Hello Wonderful World!"
   * ```
   */
  public insertText(text: string, position: number) {
    if (position < 0 || position > this._content.length) {
      PLUGIN_LOGGER.ERROR(pp`Cannot insert text at position ${position}`);
      return;
    }
    let old = this._content;
    this._content = old.slice(0, position) + text + old.slice(position);
  }

  /**
   * Deletes a length of text at a specified position.
   * Ex.:
   * ```typescript
   * state.content; // "Hello World!"
   * state.deleteText(6, 6);
   * state.content; // "Hello!"
   * ```
   */
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

/**
 * The provider for code injection and plugin creation, used for creating new plugins.
 * Let's create one now!
 * Start by sub-classing PluginProvider:
 * ```typescript
 *  class MyPlugin extends PluginProvider {
 *
 * }
 * ```
 * Next override any functions you need. Let's override onKeyPressed, and log a
 * message when the user types an "a":
 * ```typescript
 * //...
 * override onKeyPressed(key: string, state: EditorState) {  // We could totally omit state if we wanted.
 *   if (key == "a") {
 *     CLIENT_LOGGER.INFO(`"A" key pressed!`);
 *   }
 * }
 * //...
 * ```
 * Now you just create a new {@link Plugin} and register it, and you see the messages in the console!
 */
export abstract class PluginProvider {
  public onInitialize() {}
  public onKeyPressed(key: string, state: EditorState) {}
}

export class PluginConfig {
  constructor({}) {}
}

/**
 * A plugin sourc can use to inject code into the editor.
 * To make one all you need is an instance of a subclass of {@link PluginProvider}
 * and a {@link PluginConfig} object.
 */
export class SourcPlugin {
  constructor(
    public readonly provider: PluginProvider,
    public readonly config: PluginConfig
  ) {}
}
