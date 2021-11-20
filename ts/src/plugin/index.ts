import { CaretSelection } from '../tool/dom-tools';
import { StateChange } from '../state';

/**
 * Contains mutable state for the editor.
 * It is passed around plugins and mutated to edit the editor state.
 */
export class EditorState {
  constructor(
    public readonly content: string,
    public readonly selection: CaretSelection | null
  ) {}

  public copyFrom({
    content,
    selection,
  }: {
    content?: string;
    selection?: CaretSelection | null;
  }): EditorState {
    return new EditorState(
      content ?? this.content,
      selection ?? this.selection
    );
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
  public async onInitialize() {}
  public async onKeyPressed(
    key: string,
    state: EditorState
  ): Promise<StateChange[]> {
    return [];
  }
}

export type PluginSettings = {}; // For expansion

export class PluginConfig {
  constructor({}: PluginSettings) {}
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

export * from "./util";
