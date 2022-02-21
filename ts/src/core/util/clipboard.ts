export async function readClipboard(): Promise<string> {
  return await navigator.clipboard.readText();
}

/**
 * Copies text to the clipboard. May not immediately take effect.
 * @param text Text to write.
 * @returns The success of the clipboard copy.
 */
export async function writeClipboard(text: string): Promise<boolean> {
  await writeClipboardUnchecked(text);
  return (await readClipboard()) == text;
}

/**
 * Copies text to the clipboard. May not immediately take effect.
 * @param text Text to write.
 */
export async function writeClipboardUnchecked(text: string) {
  await navigator.clipboard.writeText(text);
}
