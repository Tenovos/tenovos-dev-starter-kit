module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    es2022: true,
    // es2022: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    emcaVersion: 13,
    sourceType: 'script',
  },
  rules: {
    'array-bracket-newline': [
      'error',
      {
        minItems: 1,
        multiline: true,
      },
    ],
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
      },
    ],
    'no-shadow': [
      'error',
    ],
    'object-curly-newline': [
      'error',
      {
        ExportDeclaration: {
          multiline: true,
        },
        ImportDeclaration: {
          multiline: true,
        },
        ObjectExpression: {
          minProperties: 1,
          multiline: true,
        },
        ObjectPattern: {
          multiline: true,
        },
      },
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
  },
};
