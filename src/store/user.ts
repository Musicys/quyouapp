import { defineStore } from 'pinia';
import { ref } from 'vue';
import { User } from '@/api/user/model/type';
import { UserLogin } from '@/api/user';
import { UserUpdateLongitude } from '@/api/user';
import router from '@/router';

export const useStore = defineStore(
   'user',
   () => {
      const userInfo = ref<User>(null);
      const Tokens = ref<User[]>([]);
      const location = ref<{
         lat: number;
         lng: number;
      }>({
         lat: 0,
         lng: 0
      }); //经纬度

      const setLocation = () => {
         console.log('ces==》');
         uni.getLocation({
            type: 'wgs84',
            success: function (res) {
               location.value.lat = res.latitude;
               location.value.lng = res.longitude;

               UserUpdateLongitude({
                  lat: res.latitude,
                  lng: res.longitude
               }).then(res => {
                  if (res.code == 0) {
                     //更新成功
                     setUserInfo(res.data);
                  }
               });
            },
            fail: function (res) {
               console.log('获取位置失败', res);
            }
         });
      };

      const setUserInfo = (val: User) => {
         userInfo.value = val;
         location.value.lat = userInfo.value.lat;
         location.value.lnt = userInfo.value.lnt;
         if (userInfo.value.username == null) {
            router.push({
               path: '/pages/login/personal/index'
            });
         }
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
      return {
         userInfo,
         setUserInfo,
         Tokens,
         setTokens,
         autoLogin,
         location,
         setLocation
      };
   },
   {
      unistorage: true // 开启后对 state 的数据读写都将持久化
   }
);
