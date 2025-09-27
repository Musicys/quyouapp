import { HttpGet, HttpPost } from '@/util/http';

/**
 * @description 距离获取用户列表
 * @param data { page: number; pageSize: number; }
 * @returns Promise
 */
export const UserListLongitude = (data: {
   lat: number;
   lng: number;
   page: number;
   pageSize: number;
}) => {
   return HttpPost('/api/user/userListLongitude', data);
};

/**
 * @description 全部用户
 * @param data { page: number; pageSize: number; }
 * @returns Promise
 */
export const UserList = (data: {
   current: number;
   gender?: 0 | 1;
   id?: number;
   pageSize: number;
   userAccount?: string;
   userStatus: 0;
   username?: string;
}) => {
   return HttpPost('/api/user/userlist', data);
};
