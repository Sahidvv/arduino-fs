// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-refresh/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'react-hooks', 'react-refresh'],
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Puedes personalizar tus reglas aquí
    },
  }
  