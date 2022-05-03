import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyToClipboardButton } from '../CopyToClipboardButton';

beforeAll(() => {
  userEvent.setup();
});

test('CopyToClipboardButton: ', async () => {
  const testText = 'example alt text';
  const testUrl = 'https://example.com/example.jpg';

  render(<CopyToClipboardButton text={testText} url={testUrl} />);

  const copyToClipboardButton = screen.getByRole('button');
  await userEvent.click(copyToClipboardButton);

  const actual = await navigator.clipboard.readText();
  const expected = `[${testText}](${testUrl})`;

  expect(actual).toBe(expected);
});
