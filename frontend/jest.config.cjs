module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^react-markdown$': '<rootDir>/__mocks__/react-markdown.js',
    '^remark-gfm$': '<rootDir>/__mocks__/remark-gfm.js',
    '^rehype-raw$': '<rootDir>/__mocks__/rehype-raw.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*react-markdown.*|.*remark-gfm.*|.*rehype-raw.*|.*hast-util-raw.*)'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
