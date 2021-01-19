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
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: true
  },
  plugins: ['prettier', 'import', 'simple-import-sort', 'jest'],
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
      files: ['tests/*.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
}
