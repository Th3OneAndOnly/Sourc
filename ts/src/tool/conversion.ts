export function stringToHTML(input: string) {
  let output = "";
  for (let char of input) {
    switch (char) {
      default:
        output += char;
    }
  }
  return output + "\n\n";
}
