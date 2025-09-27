import { defineStore } from 'pinia';
import { ref } from 'vue';
import { User } from '@/api/user/model/type';
import { UserLogin } from '@/api/user';
export const useStore = defineStore(
   'user',
   () => {
      const userInfo = ref<User>(null);
      const Tokens = ref<User[]>([]);
      const location = ref<{
         lat: number;
         lnt: number;
      }>({
         lat: 0,
         lnt: 0
      }); //经纬度

      const setUserInfo = (val: User) => {
         userInfo.value = val;
         location.value.lat = userInfo.value.lat;
         location.value.lnt = userInfo.value.lnt;
      };

      const setTokens = (val: User) => {
         let def = true;
         Tokens.value = Tokens.value.map(item => {
            if (item.id === val.id) {
               item.is_default = 1;
               def = false;
            } else {
               item.is_default = 0;
            }

            return item;
         });
         if (def) {
            Tokens.value.push(val);
         }
      };

      const autoLogin = (fun: () => Void = () => {}) => {
         const defaultToken = Tokens.value.find(item => item.is_default === 1);
         if (defaultToken) {
            UserLogin(defaultToken.tokens).then(res => {
               // setUserInfo(res.data);
               if (res.code == 0) {
                  fun();
               }
            });
         }
      };
      return { userInfo, setUserInfo, Tokens, setTokens, autoLogin, location };
   },
   {
      unistorage: true // 开启后对 state 的数据读写都将持久化
   }
);
