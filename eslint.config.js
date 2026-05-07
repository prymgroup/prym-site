import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  // Node.js API routes
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused vars that start with _ or uppercase, plus JSX namespace vars (motion, useThree, etc.)
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]|^(motion|useThree)$',
        caughtErrorsIgnorePattern: '^_',
        args: 'none',
      }],
      // R3F pattern: re-keying Canvas on tier/model change via setState in effect is intentional
      'react-hooks/set-state-in-effect': 'off',
      // Context files export both provider component and hook — acceptable pattern
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
