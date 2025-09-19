import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

// ✅ 正确引入 eslint-plugin-prettier（不导入 configs）
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
   {
      files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
      plugins: { js },
      extends: [js.configs.recommended],
      languageOptions: { globals: globals.browser }
   },
   { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
   ...tseslint.configs.recommended,
   ...pluginVue.configs['flat/essential'],
   {
      files: ['**/*.vue'],
      languageOptions: { parserOptions: { parser: tseslint.parser } }
   },

   // ✅ 添加 Prettier 支持（Flat Config 方式）
   {
      // 注册插件
      plugins: {
         prettier: eslintPluginPrettier
      },
      // 启用规则
      rules: {
         ...eslintPluginPrettier.configs.recommended.rules, // 继承 recommended 规则
         'prettier/prettier': 'error', // 确保格式错误被标记
         'vue/multi-word-component-names': 'off',
         '@typescript-eslint/no-explicit-any': 'off',
         '@typescript-eslint/no-empty-object-type': 'off',
         'no-undef': 'off'
      },
      // 可选：只对特定文件生效
      files: ['**/*.{js,ts,vue,jsx,tsx}'],
      ignores: ['dist/**', 'node_modules/**', '.git/**', '.husky/**', '.vscode/**', 'public/**', 'build/**']
   }
]);
