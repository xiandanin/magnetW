// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    'parser': 'babel-eslint',
    'ecmaVersion': 2017,
    'sourceType': 'module'
  },
  env: {
    node: true,
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  globals: {
    __static: true
  },
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // 关闭缩进检查
    'indent': 0,
    'vue/require-v-for-key': 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-components': 'off',
    'vue/valid-v-for': 'warn',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
