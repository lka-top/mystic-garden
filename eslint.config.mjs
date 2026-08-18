// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // 允许单字组件名 (如 Button, Select, Badge, Navbar)
    'vue/multi-word-component-names': 'off',

    // 允许 Markdown 与搜索高亮中的 v-html
    'vue/no-v-html': 'off',

    // 允许自闭合标签格式灵活性
    'vue/html-self-closing': 'off',

    // 允许未使用的变量以警告形式呈现，或以 _ 开头
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],

    // 允许特定场景下的 any 类型
    '@typescript-eslint/no-explicit-any': 'off',

    // 允许 console 调试输出
    'no-console': 'off'
  }
})
