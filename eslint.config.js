import globals from "globals";
import pluginJs from "@eslint/js";
import airbnb from "eslint-config-airbnb";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      import: importPlugin
   }
  },
  {
    rules: {
      ...airbnb.rules,
      'max-classes-per-file': 'off',
      'no-underscore-dangle': 'off',
      'no-console': 'off',
      'no-shadow': 'off',
      'no-restricted-syntax': [
        'error',
        'LabeledStatement',
        'WithStatement',
      ],
    },
  },
  {
    ignores: [
      'babel.config.js',
      'tests',
    ],
  },
];
