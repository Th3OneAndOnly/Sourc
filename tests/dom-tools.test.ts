import {
  clampSelection,
  getCaretSelection,
  getKeyType,
  isSelectionFlat,
  KeyType,
  normalizeSelection,
  setCaretSelection,
} from "../ts";

function getValidDiv(): HTMLDivElement {
  let div = document.createElement("div");
  document.body.appendChild(div);
  return div;
}

let testHTML = "";

describe("setSelection and getCaretSelection", () => {
  describe("raw text", () => {
    beforeAll(() => (testHTML = "some stuff"));

    it("makes a flat caret", () => {
      let div = getValidDiv();
      div.innerHTML = testHTML;
      setCaretSelection(div, { start: 5, end: 5 });

      let selection = getCaretSelection(div);
      expect(selection).not.toBeNull();
      expect(selection!.start).toEqual(selection!.end);
      expect(selection!.start).toEqual(5);
    });

    it("makes a wide caret", () => {
      let div = getValidDiv();
      div.innerHTML = testHTML;
      setCaretSelection(div, { start: 5, end: 8 });

      let selection = getCaretSelection(div);
      expect(selection).not.toBeNull();
      expect(selection!.start).not.toEqual(selection!.end);
      expect(selection!.start).toEqual(5);
      expect(selection!.end).toEqual(8);
    });
  });

  describe("newlines", () => {
    beforeAll(() => (testHTML = "some\nstuff"));

    it("makes a flat caret", () => {
      let div = getValidDiv();
      div.innerHTML = testHTML;
      setCaretSelection(div, { start: 5, end: 5 });

      let selection = getCaretSelection(div);
      expect(selection).not.toBeNull();
      expect(selection!.start).toEqual(selection!.end);
      expect(selection!.start).toEqual(5);
    });

    it("makes a wide caret", () => {
      let div = getValidDiv();
      div.innerHTML = testHTML;
      setCaretSelection(div, { start: 5, end: 8 });

      let selection = getCaretSelection(div);
      expect(selection).not.toBeNull();
      expect(selection!.start).not.toEqual(selection!.end);
      expect(selection!.start).toEqual(5);
      expect(selection!.end).toEqual(8);
    });
  });

  describe("spans", () => {
    beforeAll(
      () =>
        (testHTML =
          "some <span>more </span><span><span></span><span>cool</span> stuff</span>")
    );

    it("makes a flat caret", () => {
      let div = getValidDiv();
      div.innerHTML = testHTML;
      setCaretSelection(div, { start: 5, end: 5 });

      let selection = getCaretSelection(div);
      expect(selection).not.toBeNull();
      expect(selection!.start).toEqual(selection!.end);
      expect(selection!.start).toEqual(5);
    });

    it("makes a wide caret", () => {
      let div = getValidDiv();
      div.innerHTML = testHTML;
      setCaretSelection(div, { start: 5, end: 20 });

      let selection = getCaretSelection(div);
      expect(selection).not.toBeNull();
      expect(selection!.start).not.toEqual(selection!.end);
      expect(selection!.start).toEqual(5);
      expect(selection!.end).toEqual(20);
    });
  });
});

describe(isSelectionFlat, () => {
  it("reports true for flat carets", () => {
    expect(isSelectionFlat({ start: 4, end: 4 })).toBeTruthy();
  });

  it("reports false for wide carets", () => {
    expect(isSelectionFlat({ start: 4, end: 6 })).toBeFalsy();
  });
});

describe(normalizeSelection, () => {
  it("flips the end and start when end > start", () => {
    expect(normalizeSelection({ start: 1, end: 0 })).toEqual({
      start: 0,
      end: 1,
    });
  });

  it("leaves normalized carets as they are", () => {
    expect(normalizeSelection({ start: 3, end: 4 })).toEqual({
      start: 3,
      end: 4,
    });
  });
});

describe(clampSelection, () => {
  it("reports a caret within the range specified", () => {
    expect(clampSelection({ start: -3, end: 12 }, 0, 10)).toEqual({
      start: 0,
      end: 10,
    });

    expect(clampSelection({ start: 5, end: 8 }, 0, 10)).toEqual({
      start: 5,
      end: 8,
    });
  });
});

describe(getKeyType, () => {
  it("reports standard keys back", () => {
    const alphanumeric =
      "abcdefghjklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]{}|\\;:'\",./<>?`~ABCDEFGHJKLMNOPQRSTUVWXYZ" +
      "áéíóúÁÉÍÓÚäöÜÖëàèÙÒãñÑÕâôÊÎ"; // include a couple non-english keyboard characters.
    for (let letter of alphanumeric) {
      expect(getKeyType(letter)).toBe(KeyType.Other);
    }
  });

  it("reports ArrowKey for arrow keys", () => {
    for (let key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      expect(getKeyType(key)).toBe(KeyType.ArrowKey);
    }
  });

  it("reports Backspace & Delete for their respective keys", () => {
    expect(getKeyType("Backspace")).toBe(KeyType.Backspace);
    expect(getKeyType("Delete")).toBe(KeyType.Delete);
  });

  it("reports Modifier for modifier keys", () => {
    for (let key of ["Shift", "Alt", "Super", "Control"]) {
      expect(getKeyType(key)).toBe(KeyType.Modifier);
    }
  });
});
