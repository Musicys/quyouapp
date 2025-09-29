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

   await store.autoLogin(() => {
      // router.pushTab({
      //    path: '/pages/tabar/home/index'
      // });
      websocket.websocke(store.userInfo.id);
   });
});
onShow(() => {});
onHide(() => {});
</script>
<style lang="scss">
@import './uni.scss';
</style>
