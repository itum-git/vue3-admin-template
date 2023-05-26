const { defineConfig } = require('eslint-define-config')
module.exports = defineConfig({
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue', '.ts', '.tsx'],
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['vue', '@typescript-eslint'],
    extends: [
        './config/.eslintrc-auto-import.json',
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'no-debugger': 'off',
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'quotes': ['error', 'single'],
        'jsx-quotes': 'off',
        'vue/quote-props': 'off',
        'vue/html-quotes': [ 'error', 'double'],
        'no-case-declarations': 'off',
        'vue/script-setup-uses-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'vue/custom-event-name-casing': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used' }],
        'vue/html-closing-bracket-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/comment-directive': 'off',
        // 'vue/multiline-html-element-content-newline': 'off',
        // 'vue/singleline-html-element-content-newline': 'off',
        // 'vue/attribute-hyphenation': 'off',
        // 'vue/require-default-prop': 'off',
        // 'vue/require-explicit-emits': 'off',
        'vue/no-reserved-component-names': 'off',
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'never',
                    component: 'always'
                },
                svg: 'always',
                math: 'always'
            }
        ],
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
        'vue/html-indent': ['warn', 'tab'],
        'vue/valid-v-model': 'off'
    }
})
