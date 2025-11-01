<template>
   <view class="tabar">
      <view class="router">
         <home v-if="currentTabbar === 0"></home>
         <dynamic v-if="currentTabbar === 1"></dynamic>
         <message v-if="currentTabbar === 3"></message>
         <mine v-if="currentTabbar === 4"></mine>
      </view>

      <tn-tabbar
         v-model="currentTabbar"
         :animation="true"
         :safeAreaInsetBottom="true"
         icon-size="54"
         font-size="24"
         height="120rpx"
         :before-switch="beforeSwitch"
         fixed>
         <tn-tabbar-item
            v-for="(item, index) in tabbarData"
            :key="index"
            :icon="item.inactiveIcon"
            :active-icon="item.activeIcon"
            :text="item.title"
            :bulge="index === 2"
            bulge-bg-color="tn-gradient__cool-6" />
      </tn-tabbar>
   </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import Dynamic from './dynamic/index.vue';
import Home from './home/index.vue';
import Mine from './mine/index.vue';
import { useRouter } from 'uni-mini-router';
import Message from './message/index.vue';
const router = useRouter();
const currentTabbar = ref(0);

// 导航栏数据
const tabbarData = [
   {
      title: '首页',
      activeIcon: '../../static/tabbar/home_tnnew.png',
      inactiveIcon: '../../static/tabbar/home_tn.png'
   },
   {
      title: '动态',
      activeIcon: '../../static/tabbar/circle_tnnew.png',
      inactiveIcon: '../../static/tabbar/circle_tn.png'
   },
   {
      title: '发布',
      activeIcon: 'menu-circle',
      inactiveIcon: 'rocket',
      activeIconColor: '#FFFFFF',
      inactiveIconColor: '#FFFFFF',
      iconSize: 50,
      out: true
   },
   {
      title: '消息',
      activeIcon: '../../static/tabbar/preferred_tnnew.png',
      inactiveIcon: '../../static/tabbar/preferred_tn.png'
   },
   {
      title: '我的',
      activeIcon: '../../static/tabbar/mine_tnnew.png',
      inactiveIcon: '../../static/tabbar/mine_tn.png'
   }
];
const beforeSwitch = (index: number, name: string | number) => {
   if (index === 2) {
      router.push({ name: 'sumbitfrom' });
      return false;
   }
   return true;
};
onLoad(() => {
   uni.hideTabBar();
   uni.removeStorageSync('selectedIndex');
});
</script>

<style lang="scss" scoped>
.router {
   padding-top: var(--status-bar-height); /* 状态栏 */
   padding-bottom: env(safe-area-inset-bottom); /* 底部安全区 */
}
:deep() {
   .tn-tabbar__placeholder {
      display: none !important;
   }
}
</style>
