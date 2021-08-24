import { DOM_TOOLS_LOGGER } from "../private-loggers.js";
import { assert } from "./assert.js";

export type CaretSelection = { start: number; end: number };

export function isCaretFlat(caret: CaretSelection): boolean {
  return caret.start == caret.end;
}

export enum KeyType {
  Backspace,
  Delete,
  ArrowKey,
  Modifier,
  Alphanumeric,
}

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
      return KeyType.Alphanumeric;
  }
}

export function setSelection(element: HTMLElement, selection: CaretSelection) {
  let sel = window.getSelection();
  if (sel == null) return;
  let [range] = createRange(element, selection.start);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function createRange(
  node: Node,
  offset: number,
  range?: Range
): [Range, number] {
  if (!range) {
    range = document.createRange();
    range.selectNode(node);
    range.setStart(node, 0);
  }

  const [child, front] = findOffsetIntoNode(
    node,
    DOM_TOOLS_LOGGER.TRACK(offset, "offset")
  );
  assert(DOM_TOOLS_LOGGER, child != null, "Child was null!");
  range.setEnd(child, front);

  return [range, offset];
}

function findOffsetIntoNode(
  parent: Node,
  offset: number
): [Node | null, number] {
  if (parent.nodeType == Node.TEXT_NODE || parent.nodeName == "BR") {
    let content = parent.nodeName == "BR" ? "\n" : parent.textContent ?? "";
    if (content.length < offset) {
      offset -= content.length;
      return [null, offset];
    } else {
      return [parent, parent.nodeName == "BR" ? offset - 1 : offset];
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
    return [null, offset];
  }
}

export function getCaretSelection(
  element: (Node & ParentNode) | null
): CaretSelection | null {
  let selection = window.getSelection();

  if (element && selection && selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);

    return {
      start: getTextLength(element, range.startContainer, range.startOffset),
      end: getTextLength(element, range.endContainer, range.endOffset),
    };
  }
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

  if (node.nodeName == "BR") {
    output += 1;
  } else if (node.nodeType == Node.TEXT_NODE) {
    output += (node.nodeValue ?? "").length;
  } else if (node.childNodes != null) {
    node.childNodes.forEach((child) => (output += getNodeTextLength(child)));
  }

  return output;
}

function getNodeOffset(node: Node): number {
  return node == null ? -1 : 1 + getNodeOffset(<Node>node.previousSibling);
}
