import { findLineOf, findLineOffset } from '../ts';

describe(findLineOf, () => {
  // Note that lines are 0-indexed.

  it("reports 0 for single-line strings", () => {
    const string = "single line".split("");

    for (let index in string) {
      let i = parseInt(index);
      expect(findLineOf("single line", i)).toEqual(0);
    }
  });

  it("reports the 2nd line for characters in the second line.", () => {
    const string = `two\nlines`;

    expect(findLineOf(string, 5)).toEqual(1);

    expect(findLineOf(string, 4)).toEqual(1);

    expect(findLineOf(string, 3)).toEqual(0);
  });
});

describe(findLineOffset, () => {
  it("reports back the character index for single line strings", () => {
    const string = "single line".split("");

    for (let index in string) {
      let i = parseInt(index);
      expect(findLineOffset("single line", i)).toEqual(i);
    }
  });

  it("reports the offset from the current line", () => {
    const string = "hello\nbeautiful\nworld!";

    expect(findLineOffset(string, 3)).toEqual(3);
    expect(findLineOffset(string, 9)).toEqual(3);
    expect(findLineOffset(string, 19)).toEqual(3);
  });
});
