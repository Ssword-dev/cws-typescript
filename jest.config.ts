const config: import("ts-jest").JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },

  transformIgnorePatterns: [".jsx?$"],
};

export default config;
