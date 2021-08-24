///////////////////
// STRING FORMAT //
///////////////////

export function pp(strings: TemplateStringsArray, ...objs: unknown[]) {
  return strings.reduce((prev, cur, idx) => {
    let obj: unknown = '';
    if (idx < objs.length) obj = unknownToString(objs[idx]);
    return prev + cur + obj;
  }, '');
}

function unknownToString(obj: unknown): string {
  if (typeof obj === 'object') return objectToString(obj);
  else return valueToString(obj, 0);
}

function objectToString(obj: object | null): string {
  return '\n' + prettyObjectToString(obj, 0);
}

function prettyObjectToString(obj: object | null, indentLevel: number): string {
  if (obj == null) return 'null';
  let name = obj.constructor.name;
  let out = `${getIndent(indentLevel)}`;
  if (name != 'Object') out += `(${name})`;
  out += '{\n';
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
  return `${' '.repeat(level)}`;
}

function never(_param: never): never {
  throw new Error('Unreachable!');
}

function valueToString(value: unknown, indentLevel: number): string {
  if (value == null) return 'null';
  let type = typeof value;
  switch (type) {
    case 'undefined':
      return 'undefined';
    case 'string':
      return `"${value}"`;
    case 'bigint':
    case 'number':
      return (<number | bigint>value).toString();
    case 'boolean':
      return value ? 'true' : 'false';
    case 'symbol':
      return (<symbol>value).toString();
    case 'function':
      let func = <([...any]) => any>value;
      return func.name.length > 0
        ? `<function ${func.name}>`
        : `<anonymous function>`;
    case 'object':
      return '\n' + prettyObjectToString(<object>value, indentLevel + 1);
    default:
      return never(type);
  }
}

///////////////////////
// STRING OPERATIONS //
///////////////////////

export function findLineOffset(string: string, index: number): number {
  const lineNumber = string
    .split('') // To array, needed for .filter
    .slice(0, index)
    .filter(ch => ch == '\n').length;
  const previousLinesLength = string
    .split('\n')
    .slice(0, lineNumber)
    .reduce((length, line) => length + line.length + 1, 0);
  // const previousLineLength = string.split("\n")[lineNumber - 1]?.length + 1;
  // + 1 for \n
  return index - previousLinesLength;
}
