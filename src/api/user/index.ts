import { HttpPost, HttpGet } from '@/util/http';
/**
 * @description 用户登录
 * @data {userAccount: string, userPassword: string}
 * @return Promise
 */

export const UserLogin = (data: any) => {
   return HttpPost('/api/user/login', data);
};
/**
 * @description 用户是否登录
 * @data
 * @return Promise
 */

export const UserIsLogin = (data: any) => {
   return HttpGet('/api/user/isLogin');
};
/**
 * @description 用户是注销
 * @data
 * @return Promise
 */
export const UserLogout = (data: any) => {
   return HttpGet('/api/user/logout');
};
/**
 * @description 获取匹配的最近用户
 * @param params {num: number} 查询数量
 * @return Promise
 */
export const UserMatch = (params: { num: number }) => {
   return HttpGet('/api/user/match', params);
};
/**
 * @description 获取验证码
 * @param params {email: string} 邮箱地址
 * @return Promise
 */
export const UserGetVerifyCode = (params: { email: string }) => {
   return HttpGet('/api/user/emacode', params);
};
/**
 * @description 用户注册
 * @param data {checkPassword: string, planetCode: string, userAccount: string, userPassword: string}
 * @return Promise
 */
export const UserRegister = (data: {
   checkPassword: string;
   planetCode: string;
   userAccount: string;
   userPassword: string;
}) => {
   return HttpPost('/api/user/register', data);
};

/**
 * @description 完善用户信息
 * @param data
 * @return Promise
 */
export const UserExit = (data: any) => {
   return HttpPost('/api/user/exituser', data, true);
};
