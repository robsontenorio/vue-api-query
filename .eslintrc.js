module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: true
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'jest'
  ],
  ignorePatterns: ['build'],
  rules: {
    'prettier/prettier': 'error',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',

    /* Import */
    'import/no-named-as-default': 'off',

    /* Others */
    'no-console': 'error'
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-member-accessibility': ['error']
      }
    },
    {
      files: ['test/**/*.ts'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-non-null-assertion': ['off']
      }
    }
  ]
}
