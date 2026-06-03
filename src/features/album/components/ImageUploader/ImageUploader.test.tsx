/**
 * @jest-environment jsdom
 */
import { describe, expect, it, jest } from '@jest/globals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';

jest.unstable_mockModule('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => createElement('img', props),
}));

const { ImageUploader } = await import('.');

const renderUploader = (children: ReactNode): ReturnType<typeof render> => {
  const client = new QueryClient();
  return render(createElement(QueryClientProvider, { client }, createElement(ImageUploader, null, children)));
};

describe('ImageUploader', () => {
  it('renders a single upload control and the gallery children within one root', () => {
    // Arrange & Act
    const { container } = renderUploader(<p>Gallery area</p>);

    // Assert
    screen.getByText('Gallery area');
    screen.getByRole('button', { name: /add file/i });
    const inputs = container.querySelectorAll('input[type="file"]');
    expect(inputs).toHaveLength(1);
    expect(inputs[0].getAttribute('accept')).toBe('image/*');
  });
});
