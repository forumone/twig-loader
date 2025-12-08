import { defineConfig } from 'eslint/config';
import f1BaseConfig from '@forumone/eslint-config-es5';

const config = defineConfig([
  f1BaseConfig,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
]);

export default config;
