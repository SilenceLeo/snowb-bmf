import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import cspell from '@cspell/eslint-plugin'

export default [
  // Ignored files
  {
    ignores: [
      'build/**',
      'dist/**',
      'node_modules/**',
      'public/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      'src/vite-env.d.ts',
      'src/react-app-env.d.ts',
      'types/**/*.d.ts',
      'src/workers/*.worker.ts',
      'src/file/conversion/types/sbf/proto/**/*.js',
      'src/file/conversion/types/sbf/proto/**/*.d.ts',
    ],
  },

  // Recommended base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React + TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@cspell': cspell,
    },
    rules: {
      // TypeScript lenient rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // React basic rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General lenient rules
      'no-console': 'off', // Allow console during development
      'prefer-const': 'warn',
      'no-unused-vars': 'off',

      // CSpell spell checking
      '@cspell/spellchecker': ['warn', {
        checkComments: true,
        checkStrings: true,
        checkIdentifiers: true,
        checkStringTemplates: true,
        autoFix: true,
        numSuggestions: 5,
      }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Special file configuration
  {
    files: ['src/serviceWorkerRegistration.ts', 'src/service-worker.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Scripts directory configuration (Node.js scripts)
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]
