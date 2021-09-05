///////////////////
// STRING FORMAT //
///////////////////

/**
 * Pretty-print. Takes a template string and returns a formatted string.
 * Usage:
 * ```typescript
 * console.log(pp`This is my object: ${complicatedObj}`);
 * ```
 * Usually you'd need some sort of `JSON.stringify` to make certain objects display correctly, but this does it better.
 * Feedback is welcome!
 */
export function pp(strings: TemplateStringsArray, ...objs: unknown[]) {
  return strings.reduce((prev, cur, idx) => {
    let obj: unknown = "";
    if (idx < objs.length) obj = unknownToString(objs[idx]);
    return prev + cur + obj;
  }, "");
}

function unknownToString(obj: unknown): string {
  if (typeof obj === "object") return objectToString(obj);
  else return valueToString(obj, 0);
}

function objectToString(obj: object | null): string {
  return "\n" + prettyObjectToString(obj, 0);
}

function prettyObjectToString(obj: object | null, indentLevel: number): string {
  if (obj == null) return "null";
  let name = obj.constructor.name;
  let out = `${getIndent(indentLevel)}`;
  if (name != "Object") out += `(${name})`;
  out += "{\n";
  for (let [name, value] of Object.entries(obj)) {
    out += `${getIndent(indentLevel + 1)}${name}: ${valueToString(
      value,
      indentLevel + 1
    )}\n`;
  }
  out += `${getIndent(indentLevel)}}`;
  return out;
}

function getIndent(level: number): string {
  return `${" ".repeat(level)}`;
}

function never(_param: never): never {
  throw new Error("Unreachable!");
}

function valueToString(value: unknown, indentLevel: number): string {
  if (value == null) return "null";
  let type = typeof value;
  switch (type) {
    case "undefined":
      return "undefined";
    case "string":
      return `"${value}"`;
    case "bigint":
    case "number":
      return (<number | bigint>value).toString();
    case "boolean":
      return value ? "true" : "false";
    case "symbol":
      return (<symbol>value).toString();
    case "function":
      let func = <([...any]) => any>value;
      return func.name.length > 0
        ? `<function ${func.name}>`
        : `<anonymous function>`;
    case "object":
      return "\n" + prettyObjectToString(<object>value, indentLevel + 1);
    default:
      return never(type);
  }
}

///////////////////////
// STRING OPERATIONS //
///////////////////////

/**
 * Finds line offset of a certain character in a string.
 * For example:
 * ```
 * hello
 * world
 * ```
 * The line offset of character 8 is 2, because it is 2 characters forward from the line it is in.
 * @param string - String to search
 * @param index - Index of character in string
 * @returns line offset
 */
export function findLineOffset(string: string, index: number): number {
  const lineNumber = findLineOf(string, index);
  const previousLinesLength = string
    .split("\n")
    .slice(0, lineNumber)
    .reduce((length, line) => length + line.length + 1, 0);
  return index - previousLinesLength;
}

/**
 * Finds line number a particular character in a string is in.
 * @param string - String to search
 * @param index - Index of character in string
 * @returns
 */
export function findLineOf(string: string, index: number) {
  return string // For fans of iterator functions:
    .split("") // .iter()
    .slice(0, index) // .take(index)
    .filter((ch) => ch == "\n").length; // .filter().count()
}
