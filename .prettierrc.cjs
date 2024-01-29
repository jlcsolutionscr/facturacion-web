module.exports = {
  // foo => bar instead of (foo) => bar
  arrowParens: "avoid",

  printWidth: 120,

  // https://prettier.io/docs/en/options.html#trailing-commas claims that this is a default, but it doesn't actually appear to be
  trailingComma: "es5",
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^@react/(.*)$",
    "^@tss-react/(.*)$",
    "^@reduxjs/(.*)$",
    "^@mui/material$",
    "^@mui/material/(.*)$",
    "^@hookform/(.*)$",
    "^@vitejs/(.*)$",
    "",
    ".module.scss$",
    "^[./]",
    "^components/(.*)$",
    "^hooks/(.*)$",
    "^state/(.*)$",
    "^utils/(.*)$",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
  importOrderTypeScriptVersion: "5.0.0",
};
