// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    'public/projects/**',
    '.output/**',
    'playwright-report/**',
    'test-results/**',
  ],
}, {
  rules: {
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/attributes-order': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
  },
})

