import { createSSRApp } from 'vue';
import App from './App.vue';
import '@/asscess/index.css';
export function createApp() {
   const app = createSSRApp(App);
   return {
      app
   };
}
