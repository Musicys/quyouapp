import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useStore = defineStore(
   'user',
   () => {
      const userInfo = ref('hello pinia');

      const setUserInfo = (val: string) => {
         userInfo.value = val;
      };
      return { userInfo, setUserInfo };
   },
   {
      unistorage: true // 开启后对 state 的数据读写都将持久化
   }
);
