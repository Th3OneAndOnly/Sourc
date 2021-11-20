import { EditorState, PluginProvider } from '.';
import { StateChange } from '../state';

export class ListOfProviders extends PluginProvider {
  constructor(private _providers: PluginProvider[]) {
    super();
  }

  override async onInitialize() {
    this._providers.forEach((p) => p.onInitialize());
  }

  override async onKeyPressed(
    key: string,
    state: EditorState
  ): Promise<StateChange[]> {
    return (
      await Promise.all(this._providers.map((p) => p.onKeyPressed(key, state)))
    ).flat();
  }
}
