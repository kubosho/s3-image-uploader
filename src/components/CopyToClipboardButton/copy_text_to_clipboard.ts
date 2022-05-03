export async function copyTextToClipboard(text): Promise<void> {
  await navigator.clipboard.writeText(text);
}
