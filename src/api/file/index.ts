import { HttpPost } from '@/util/http';

//条件编译
//#ifdef H5
export const updateOssFile = (File: string) => {
   return uni.uploadFile({
      url: '/api/api/file',
      filePath: File,
      name: 'file',
      formData: {
         tagId: 9
      }
   });
};
//#endif
//#ifdef APP-PLUS
export const updateOssFile = (File: string) => {
   return HttpPost({
      url: '/api/api/file',
      filePath: File,
      name: 'file',
      formData: {
         tagId: 9
      }
   });
};
//#endif
