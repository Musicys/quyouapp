<script setup lang="ts">
import { useStore } from '@/store/user';
import { sockeStore } from './store/socke';
import { UserGetInfo, UserIsLogin } from '@/api/user';
import { useRouter } from 'uni-mini-router';
const router = useRouter();
const websocket = sockeStore();
const store = useStore();

onLaunch(async () => {
   //初始化登录

   await store.autoLogin(
      //登录成功
      async () => {
         let res = await UserGetInfo();
         if (res.code == 0) {
            store.setUserInfo(res.data);
         }
         router.pushTab({
            name: 'tabar'
         });
         websocket.websocke(store.userInfo.id);
      },
      //登录失败
      () => {
         router.push({
            name: 'start'
         });
         store.ColseToken();
      }
   );
});
onShow(() => {});
onHide(() => {});
</script>
<style lang="scss">
@import './uni.scss';
@import '@tuniao/tn-style/dist/uniapp/index.css';
</style>
