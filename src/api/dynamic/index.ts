import { HttpPost } from '@/util/http';

/**
 * @description 距离动态列表
 * @param data { lat: number, lng: number, page: number, pageSize: number, province: string }
 * @returns Promise
 */
export const getDynamicList = (data: {
   lat: number;
   lng: number;
   page: number;
   pageSize: number;
   province: string;
}) => {
   return HttpPost('/api/dynamic/list', data);
};

/**
 * @description 添加动态
 * @param data { context: string, imgArr: string, lat: number, lng: number, userId: number }
 * @returns Promise
 */
export const addDynamic = (data: {
   context: string;
   imgArr: string;
   lat: number;
   lng: number;
   userId: number;
}) => {
   return HttpPost('/api/dynamic/add', data);
};
