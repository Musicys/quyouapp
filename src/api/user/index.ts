import { HttpPost } from '@/util/http';
/**
 * @description 用户登录
 * @data {userAccount: string, userPassword: string}
 * @return Promise
 */

export const UserLogin = (data: any) => {
   return HttpPost('/api/user/login', data);
};
