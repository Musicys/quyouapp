<script setup lang="ts">
import { useStore } from '@/store/user';
import { sockeStore } from './store/socke';
import { UserIsLogin } from '@/api/user';
import { useRouter } from 'uni-mini-router';
const router = useRouter();
const websocket = sockeStore();
const store = useStore();

onLaunch(async () => {
   //初始化登录
   console.log('App Launch');

   //当前环境
   console.log('当前环境', import.meta.env);

   await store.autoLogin(
      () => {
         router.pushTab({
            name: 'tabar'
         });
         websocket.websocke(store.userInfo.id);
      },
      () => {
         router.push({
            name: 'start'
         });
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
