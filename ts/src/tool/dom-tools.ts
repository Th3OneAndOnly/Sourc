import { assert } from './assert';
import { clamp } from './general';
import { DOM_TOOLS_LOGGER } from '../private-loggers';
import { pp } from './string';

/**
 * A type representing a caret selection. `start` == `end` when the caret is flat (a line, not a box).
 */
export type CaretSelection = { start: number; end: number };

/**
 * Determines whether a {@link CaretSelection caret selection} is flat
 * @param caret
 * @returns true if caret is flat
 */
export function isSelectionFlat(caret: CaretSelection): boolean {
  return caret.start == caret.end;
}

export function normalizeSelection(caret: CaretSelection): CaretSelection {
  if (caret.start > caret.end)
    return {
      start: caret.end,
      end: caret.start,
    };
  else return caret;
}

/**
 * Clamps selection to a range of numbers
 * @param selection - selection to clamp
 * @param min - minimum number to clamp to
 * @param max - maximum number to clamp to
 * @returns clamped selection
 */
export function clampSelection(
  selection: CaretSelection,
  min: number,
  max: number
): CaretSelection {
  return {
    start: clamp(min, max, selection.start),
    end: clamp(min, max, selection.end),
  };
}

/**
 * The type of a key pressed, kind of like a categorization.
 */
export enum KeyType {
  /**
   * Key is the backspace key
   */
  Backspace,
  /**
   * Key is the delete key
   */
  Delete,
  /**
   * Key is an arrow key
   */
  ArrowKey,
  /**
   * Key is some sort of modifier key
   */
  Modifier,
  /**
   * Key is any other key
   */
  Other,
}

/**
 * Gets key type heralding to a key given by a {@link KeyEvent}'s key.
 */
export function getKeyType(key: string): KeyType {
  switch (key) {
    case "Backspace":
      return KeyType.Backspace;
    case "Delete":
      return KeyType.Delete;
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      return KeyType.ArrowKey;
    case "Shift":
    case "Control":
    case "Alt":
    case "Super":
      return KeyType.Modifier;
    default:
      return KeyType.Other;
  }
}

/**
 * Sets the caret selection on an element.
 */
export function setCaretSelection(
  element: HTMLElement,
  selection: CaretSelection
) {
  selection = normalizeSelection(selection);

  let sel = window.getSelection();
  /* istanbul ignore next */
  if (sel == null) return;

  let range = createRange(element, selection.start);
  let [endContainer, endOffset] = findOffsetIntoNode(element, selection.end);
  assert(DOM_TOOLS_LOGGER, endContainer != null, "End offset too large!");

  range.collapse(false);
  range.setEnd(endContainer, endOffset);
  sel.removeAllRanges();
  sel.addRange(range);
}

function createRange(node: Node, offset: number): Range {
  const range = document.createRange();
  range.selectNode(node);
  range.setStart(node, 0);

  const [child, front] = findOffsetIntoNode(node, offset);
  assert(DOM_TOOLS_LOGGER, child != null, "Child was null!");
  range.setEnd(child, front);

  return range;
}

function findOffsetIntoNode(
  parent: Node,
  offset: number
): [Node | null, number] {
  if (parent.nodeType == Node.TEXT_NODE) {
    let content = parent.textContent!;
    if (content.length < offset) {
      offset -= content.length;
      return [null, offset];
    } else {
      return [parent, offset];
    }
  } else {
    for (let i = 0; i < parent.childNodes.length; i++) {
      let [node, newOffset] = findOffsetIntoNode(parent.childNodes[i], offset);
      if (!node) {
        offset = newOffset;
      } else {
        return [node, newOffset];
      }
    }
    /* istanbul ignore next */
    return [null, offset];
  }
}

/**
 * Retrieves the cursor position as a {@link CaretSelection} from an element.
 * @returns null if `element` is not being selected at the moment.
 */
export function getCaretSelection(
  element: Node & ParentNode
): CaretSelection | null {
  let selection = window.getSelection();

  /* istanbul ignore else */
  if (selection && selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);

    return {
      start: getTextLength(element, range.startContainer, range.startOffset),
      end: getTextLength(element, range.endContainer, range.endOffset),
    };
  }

  /* istanbul ignore next */
  return null;
}

function getTextLength(
  element: Node & ParentNode,
  node: Node,
  offset: number
): number {
  let output = 0;

  if (node.nodeType == Node.TEXT_NODE) {
    output += offset;
  } else {
    for (let i = 0; i < offset; i++) {
      output += getNodeTextLength(node.childNodes[i]);
    }
  }

  if (node != element && node.parentNode) {
    output += getTextLength(element, node.parentNode, getNodeOffset(node));
  }

  return output;
}

function getNodeTextLength(node: Node): number {
  let output = 0;

  if (node.nodeType == Node.TEXT_NODE) {
    output += node.nodeValue!.length;
  } else {
    node.childNodes.forEach((child) => (output += getNodeTextLength(child)));
  }

  return output;
}

function getNodeOffset(node: Node): number {
  return node == null ? -1 : 1 + getNodeOffset(<Node>node.previousSibling);
}
