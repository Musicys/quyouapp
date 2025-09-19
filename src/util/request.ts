// src/http.js
import Request from 'luch-request';
const service = new Request();

// 全局配置
service.setConfig(config => {
   config.baseURL = import.meta.env.VITE_APP_BASE_API; // 根据环境变量设置基础 URL
   config.timeout = 25000; // 设置超时时间
   config.withCredentials = true; // 跨域请求时是否携带凭证（cookies）
   return config;
});
// 请求拦截器
service.interceptors.request.use(
   config => {
      // 可添加 Token 或其他自定义逻辑
      config.header = {
         ...config.header,
         Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      };
      return config;
   },
   error => {
      console.error('请求错误:', error);
      return Promise.reject(error);
   }
);
// 响应拦截器
service.interceptors.response.use(
   response => {
      const { data } = response;
      if (data.code !== 0) {
         uni.showToast({ title: data.description || data.message || '请求失败', icon: 'none' });
         return Promise.reject(data);
      }
      return data;
   },
   error => {
      uni.showToast({ title: '网络错误', icon: 'error' });
      return Promise.reject(error);
   }
);
export default service;
