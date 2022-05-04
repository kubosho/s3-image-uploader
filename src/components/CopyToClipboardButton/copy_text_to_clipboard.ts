export async function copyTextToClipboard(text): Promise<void> {
  // NOTE: Doesn't work in http://0.0.0.0
  await navigator.clipboard.writeText(text);
}
