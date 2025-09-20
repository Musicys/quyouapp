import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useStore = defineStore(
   'user',
   () => {
      const userInfo = ref<User>(null);
      const Tokens = ref<User[]>([]);

      const setUserInfo = (val: string) => {
         userInfo.value = val;
      };

      const setTokens = (val: string) => {
         Tokens.value = val;
      };

      return { userInfo, setUserInfo, Tokens, setTokens };
   },
   {
      unistorage: true // 开启后对 state 的数据读写都将持久化
   }
);
