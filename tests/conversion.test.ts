import { stringToHTML } from '../ts/src/tool/conversion';

describe(stringToHTML, () => {
  it("appends two newlines to the end of the text", () => {
    expect(stringToHTML("hel lo\nwo rl d")).toEqual("hel lo\nwo rl d\n\n");
  });
});
