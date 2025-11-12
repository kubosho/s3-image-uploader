import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  clearMocks: true,
  testEnvironment: 'jest-environment-jsdom',
};

export default createJestConfig(customJestConfig);
