module.exports = {
  preset: "jest-preset-angular",
  roots: ["<rootDir>/src"],
  modulePaths: ['<rootDir>/dist'],
  setupFilesAfterEnv: [
    "<rootDir>/src/setup-jest.ts",
  ],
  globals: {
    "__webpack_public_path__": true
  },
  moduleNameMapper: {
    "@env/environment": "<rootDir>/src/environments/environment",
    "@assets/(.*)": "<rootDir>/src/assets/$1",
    "@style/(.*)": "<rootDir>/src/style/$1",
    "@helpers/(.*)": "<rootDir>/src/app/helpers/$1",
    "@infra/(.*)": "<rootDir>/src/app/infra/$1",
    "@shared/(.*)": "<rootDir>/src/app/shared/$1",
    "@modules/(.*)": "<rootDir>/src/app/modules/$1",
    "@app/(.*)": "<rootDir>/src/app/$1",
    "@tests/(.*)": "<rootDir>/src/tests/$1",
    "@src/(.*)": "<rootDir>/src/$1",
  },
  testMatch: [
    "**/src/**/*.spec.ts",
    "**/src/**/*.test.ts"
  ],coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/src/test.ts",
    "<rootDir>/src/tests/*",
    "<rootDir>/src/environments/*",
    "<rootDir>/src/app/infra/interceptors/index-interceptor.ts",
    "<rootDir>/src/app/helpers/*",
    "<rootDir>/src/app/shared/utils/*",
    '<rootDir>/src/app/shared/mocks',
    '.model.ts',
    '.dictionary.ts',
    '.module.ts',
    '.pipe.ts',
    '.enum.ts',
    '.validator.ts',
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/src/test.ts",
  ],
  coverageThreshold: {
    global: {
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  collectCoverage: false
};
