import { CaretSelection } from "./tool/dom-tools.js";

export abstract class Action {
  public abstract getNewSelection(input: string): CaretSelection;
  public abstract outputText(input: string): string;
}
