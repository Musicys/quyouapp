// src/http.js
import Request from 'luch-request';
const service = new Request();

const configs = {
   cookie: null
};

// 全局配置
service.setConfig(config => {
   // #ifdef H5
   // config.baseURL = import.meta.env.VITE_APP_BASE_API; // 根据环境变量设置基础 URL
   config.baseURL = '/api/'; // 根据环境变量设置基础 URL
   // #endif
   // #ifdef APP-PLUS
   config.baseURL = 'http://101.42.172.99:8080'; // 根据环境变量设置基础 URL
   // #endif

   config.timeout = 25000; // 设置超时时间
   config.withCredentials = true; // 跨域请求时是否携带凭证（cookies）
   return config;
});
// 请求拦截器
service.interceptors.request.use(
   config => {
      // 可添加 Token 或其他自定义逻辑

      if (configs.cookie != null) {
         config.header = {
            ...config.header,
            Cookie: configs.cookie
         };
      } else {
         config.header = {
            ...config.header
         };
      }

      return config;
   },
   error => {
      return Promise.reject(error);
   }
);
// 响应拦截器
service.interceptors.response.use(
   response => {
      const { data, config } = response;
      // #ifdef APP-PLUS

      if (config.url == '/api/user/login' && response.cookies[0]) {
         configs.cookie = response.cookies[0];
      }
      // #endif
      if (data.code === 40101) {
         return data;
      }

      if (data.code !== 0) {
         uni.showToast({
            title: data.description || data.message || '请求失败',
            icon: 'none'
         });
         return Promise.reject(data);
      }
      return data;
   },
   error => {
      uni.showToast({ title: '网络错误', icon: 'error' });
      console.log('请求错误:', error);
      return Promise.reject(error);
   }
);
export default service;
