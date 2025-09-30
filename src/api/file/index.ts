import { HttpPost } from '@/util/http';

export const updateOssFile = (File: FormData) => {
   return HttpPost('/api/file', File, true);
};
