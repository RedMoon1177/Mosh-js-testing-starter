import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 'space-before-function-paren': ['error', 'always'],
      'space-before-function-paren': 'off',
      semi: ['error', 'always'],
    },
  },
  pluginJs.configs.recommended,
];
