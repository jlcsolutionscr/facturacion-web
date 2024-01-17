module.exports = {
  root: true,
  ignorePatterns: [
    // exclude build artifacts as well as all JavaScript
    "/dist/",
    ".*.js",
    "*.jsx",
    ".*.cjs",
    "*.json",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.node.json"],
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // disables rules that are unnecessary or might conflict with prettier; should be loaded last
  ],
  rules: {
    // prevent bugs like [(1, 2, 3)]. rarely intentional codegolf feature.
    "no-restricted-syntax": ["error", "SequenceExpression"],

    // usefulness is debatable but makes some text nodes less legible
    "react/no-unescaped-entities": "off",

    // No point in fixing this instead of just migrating these components to TypeScript
    "react/prop-types": "off",

    // suppress errors for missing 'import React' in files
    "react/react-in-jsx-scope": "off",

    // overly restrictive rules
    "no-prototype-builtins": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": "off",

    // temporarily disabled because of many preexisting errors
    "react/display-name": "off",
  },
  settings: {
    react: { version: "detect" },
    polyfills: ["Navigator", "Notification"],
  },
  env: {
    browser: true,
  },
};
