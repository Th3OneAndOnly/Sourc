import { Action } from "./action.js";
import { CaretSelection } from "./tool/dom-tools.js";
import { clamp } from "./tool/general.js";

export class BlankAction extends Action {
  public getNewSelection(_input: string): CaretSelection {
    return { start: 0, end: 0 };
  }

  public outputText(input: string): string {
    return input;
  }
}

export class InsertText extends Action {
  constructor(private text: string, private position: number) {
    super();
  }

  public getNewSelection(_input: string): CaretSelection {
    return { start: this.position + 1, end: this.position + 1 };
  }

  public outputText(input: string): string {
    return (
      input.slice(0, this.position) + this.text + input.slice(this.position)
    );
  }
}

export class DeleteText extends Action {
  constructor(private start: number, private length: number) {
    super();
  }

  public getNewSelection(_input: string): CaretSelection {
    return { start: this.start, end: this.start };
  }

  public outputText(input: string): string {
    return input.slice(0, this.start) + input.slice(this.start + this.length);
  }
}

export class MoveCaret extends Action {
  constructor(private position: CaretSelection) {
    super();
  }

  public getNewSelection(input: string): CaretSelection {
    return {
      start: this.position.start,
      end: this.position.start,
    };
  }

  public outputText(input: string): string {
    return input;
  }
}
