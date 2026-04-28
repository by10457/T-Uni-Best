import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  insertFinalNewline: true,
  sortPackageJson: false,
  ignorePatterns: [
    'node_modules',
    'dist',
    'unpackage',
    '.agents/**',
    '**/uni_modules/**',
    '**/nativeplugins/**',
    'src/pages.json',
    'src/manifest.json',
    'src/service/**',
    'src/types/**',
    'src/pages.d.ts',
    'pnpm-lock.yaml',
    '**/*.{png,jpg,jpeg,gif,webp,ico,svg}',
    '**/*.{sh,crt,key,pem,p12}',
  ],
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc', '**/*.json', '**/*.json5', '**/*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
})
