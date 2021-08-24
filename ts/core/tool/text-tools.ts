export enum DifferenceType {
  ADDITION,
  DELETION,
}

export type TextDifference = {
  type: DifferenceType;
  content: string;
  delta: number;
};

export function findDifferences(
  original: string,
  differed: string
): TextDifference[] {
  original = original.replace(/[^\S\n]/g, " ");
  differed = differed.replace(/[^\S\n]/g, " ");
  let difference = differed.length - original.length;
  let [indexOfAlteredChar, lengthOfAlteredChars] = indicesOfAlteredChars(
    original,
    differed
  );
  if (indexOfAlteredChar == null) return [];
  if (lengthOfAlteredChars != Math.abs(difference)) {
    return [
      {
        type: DifferenceType.DELETION,
        content: original.substr(
          indexOfAlteredChar,
          lengthOfAlteredChars - difference
        ),
        delta: indexOfAlteredChar,
      },
      {
        type: DifferenceType.ADDITION,
        content: differed.substr(indexOfAlteredChar, lengthOfAlteredChars),
        delta: indexOfAlteredChar,
      },
    ];
  }
  return [
    {
      type: difference > 0 ? DifferenceType.ADDITION : DifferenceType.DELETION,
      content: (difference > 0 ? differed : original).substr(
        indexOfAlteredChar,
        lengthOfAlteredChars
      ),
      delta: indexOfAlteredChar,
    },
  ];
}

function indicesOfAlteredChars(
  original: string,
  differed: string
): [number | null, number] {
  let index = 0,
    length = 0;
  while (index + length < original.length || index + length < differed.length) {
    if ((original[index + length] ?? "") !== (differed[index + length] ?? "")) {
      length++;
      continue;
    }
    if (length > 0) {
      break;
    }
    index++;
  }
  if (length == 0) return [null, 0];
  return [index, length];
}

export function applyDifferences(
  original: string,
  changes: TextDifference[]
): string {
  let output = original;
  for (let change of changes) {
    switch (change.type) {
      case DifferenceType.ADDITION:
        output =
          output.slice(0, change.delta) +
          change.content +
          output.slice(change.delta);
        break;
      case DifferenceType.DELETION:
        output =
          output.slice(0, change.delta) +
          output.slice(change.delta + change.content.length);
        break;
    }
  }
  return output;
}
