import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,

  // ==================== 自定义规则 ====================
  // 以下规则可根据需要开启/关闭，将规则值改为 'off' 关闭，'warn' 警告，'error' 报错
  {
    name: 'app/custom-rules',
    rules: {
      // ---------- TypeScript 严格模式相关 ----------
      // 禁止使用 any 类型
      '@typescript-eslint/no-explicit-any': 'off',

      // 禁止不安全的成员访问（如 string 索引无签名对象）
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // 禁止不安全的赋值
      '@typescript-eslint/no-unsafe-assignment': 'off',

      // 禁止不安全的函数参数
      '@typescript-eslint/no-unsafe-argument': 'off',

      // 禁止不安全的调用
      '@typescript-eslint/no-unsafe-call': 'off',

      // 禁止不安全的返回值
      '@typescript-eslint/no-unsafe-return': 'off',

      // ---------- 通用规则 ----------
      // 允许 console
      'no-console': 'off',

      // 允许 debugger
      'no-debugger': 'warn',
      semi: [2, "always"], //语句强制分号结尾

      // 未使用的变量（参数不检查）
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],

      // ---------- Vue 规则 ----------
      // 组件名不强制多词
      'vue/multi-word-component-names': 'off',
    },
  },
)
