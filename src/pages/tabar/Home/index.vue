<template>
   <view class="page">
      <wd-tabs v-model="tab" swipeable>
         <block v-for="item in tabs" :key="item.value">
            <wd-tab :title="`${item.title}`" :name="item.value">
               <view class="content" v-if="tab == 0"> <Alluser></Alluser> </view
               ><view class="content" v-if="tab == 1">
                  <Dicuser></Dicuser>
               </view>
            </wd-tab>
         </block>
      </wd-tabs>
      <view class="but"> <wd-icon name="chat" size="22px"></wd-icon> </view>
   </view>
</template>

<script setup lang="ts">
import Alluser from './components/Alluser.vue';
import Dicuser from './components/Dicuser.vue';

const tabs = ref([
   {
      title: '全部',
      value: '0'
   },
   {
      title: '附近',
      value: '1'
   },
   {
      title: '兴趣',
      value: '2'
   }
]);
const tab = ref(0);
</script>

<style lang="scss" scoped>
:deep() {
   .wd-tabs__nav-container {
      width: 350rpx;
   }
   .is-active {
      font-size: 36rpx !important;
   }
   .wd-tabs__nav {
      position: fixed;
      top: var(--status-bar-height);
      z-index: 1;
      background: $quyou-nav-bg-color;
      height: $quyou-nav-height;
   }
   .zp-page-top {
      z-index: -1 !important;
   }
}
.page {
   position: relative;
   padding-top: var(--status-bar-height); /* 状态栏 */
   padding-bottom: env(safe-area-inset-bottom); /* 底部安全区 */
}
.content {
   background: linear-gradient(160deg, #f2e9d2, #fff);
}
.but {
   position: fixed;

   top: var(--status-bar-height);
   z-index: 99;
   right: 15rpx;
}
</style>
