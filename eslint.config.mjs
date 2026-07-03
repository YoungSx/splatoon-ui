import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'apps/*/.next/**',
    'apps/*/out/**',
    'packages/*/dist/**',
    'next-env.d.ts',
    '.venv/**',
    'scratch/**',
  ]),
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
])

export default eslintConfig
