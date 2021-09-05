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
  it("reports the correct line offset for strings", () => {
    expect(findLineOffset(`hello\nworld`, 10)).toEqual(4);
  });
});
