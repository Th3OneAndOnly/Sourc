import { CaretSelection } from './tool/dom-tools';
import { EditorState } from './plugin';
import { PLUGIN_LOGGER } from './private-loggers';
import { pp } from './tool/string';

export abstract class StateChange {
  public abstract isIdenticalTo(other: StateChange): boolean;
  public abstract transformState(state: EditorState): EditorState;
}

export class InsertText extends StateChange {
  constructor(public readonly text: string, public readonly pos: number) {
    super();
  }

  public isIdenticalTo(other: StateChange): boolean {
    if (other instanceof InsertText) {
      if (other.text != this.text) return false;
      if (other.pos != this.pos) return false;
      return true;
    }
    return false;
  }

  public transformState(state: EditorState): EditorState {
    let oldContent = state.content;
    if (this.pos < 0 || this.pos > oldContent.length) {
      PLUGIN_LOGGER.ERROR(pp`Cannot insert text at position ${this.pos}`);
      return state;
    }
    let content =
      oldContent.slice(0, this.pos) + this.text + oldContent.slice(this.pos);
    return state.copyFrom({ content });
  }
}

export class DeleteText extends StateChange {
  constructor(public readonly start: number, public readonly length: number) {
    super();
  }

  public isIdenticalTo(other: StateChange): boolean {
    if (other instanceof DeleteText) {
      if (other.start != this.start) return false;
      if (other.length != this.length) return false;
      return true;
    }
    return false;
  }

  public transformState(state: EditorState): EditorState {
    let oldContent = state.content;
    if (this.start < 0 || this.start > oldContent.length) {
      PLUGIN_LOGGER.ERROR(pp`Cannot delete text at position ${this.start}`);
      return state;
    }

    if (
      this.start + this.length < 0 ||
      this.start + this.length > state.content.length
    ) {
      PLUGIN_LOGGER.ERROR(pp`Cannot delete text of length ${this.length}`);
      return state;
    }

    let content =
      oldContent.slice(0, this.start) +
      oldContent.slice(this.start + this.length);
    return state.copyFrom({ content });
  }
}

export class SetSelection extends StateChange {
  constructor(public readonly selection: CaretSelection | null) {
    super();
  }

  public isIdenticalTo(other: StateChange): boolean {
    if (other instanceof SetSelection) {
      if (other.selection != this.selection) return false;
      return true;
    }
    return false;
  }

  public transformState(state: EditorState): EditorState {
    return state.copyFrom({ selection: this.selection });
  }
}
