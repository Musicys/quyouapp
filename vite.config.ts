// vite.config.mts
import { defineConfig } from 'vite';

import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';
import Components from '@uni-helper/vite-plugin-uni-components';
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers';
import eslintPlugin from 'vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
   plugins: [
      tailwindcss(),
      uni.default(),
      Components({
         resolvers: [WotResolver()]
      }),
      eslintPlugin({
         include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'], // 指定需要检查的文件
         exclude: ['node_modules/**', 'dist/**'], // 指定不需要检查的文件
         fix: true, // 是否自动修复
         cache: false // 是否启用缓存
      })
   ],
   css: {
      preprocessorOptions: {
         scss: {
            quietDeprecations: ['all']
         }
      }
   },
   build: {
      sourcemap: false
   },
   resolve: {
      alias: {
         '@': resolve(__dirname, 'src')
      }
   },
   server: {
      host: 'localhost',
      port: 9999,
      open: true,
      proxy: {
         '/api': {
            target: 'https://qq320.cc/',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
         }
      }
   }
});
