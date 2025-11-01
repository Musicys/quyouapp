<template>
   <view class="page">
      <wd-tabs v-model="istab" swipeable>
         <block v-for="item in tab" :key="item.name">
            <wd-tab :title="item.title" :name="item.name">
               <view class="content" v-if="istab == 0">
                  <Dynamic />
               </view>
               <view class="content" v-if="istab == 1">
                  <Tag />
               </view>
            </wd-tab>
         </block>
      </wd-tabs>
      <view class="but" @click="toSubmit">
         <wd-icon name="chat"></wd-icon>
      </view>
      <view class="post-btn" @click="router.push({ name: 'sumbitfrom' })">
         <wd-icon name="add"></wd-icon>
      </view>
   </view>
</template>

<script setup lang="ts">
import Dynamic from './components/Dynamic.vue';
import Tag from './components/Tag.vue';
import { useRouter } from 'uni-mini-router';
const router = useRouter();
const istab = ref(0);
const tab = ref([
   { title: '动态', name: '0' },
   { title: '关注', name: '1' }
]);
const set = e => {
   console.log(e);
};
const toSubmit = () => {
   router.push({ name: 'search' });
};
</script>

<style lang="scss" scoped>
:deep() {
   .wd-tabs__nav-container {
      width: 250rpx;
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
.but {
   position: fixed;

   top: var(--status-bar-height);
   z-index: 99;
   right: 15rpx;
}

/* 发送动态悬浮按钮 */
.post-btn {
   position: fixed;
   bottom: 120rpx;
   right: 30rpx;
   z-index: 99;
   width: 80rpx;
   height: 80rpx;
   border-radius: 50%;
   background-color: #0bdaee;
   z-index: 9999 !important;
   display: flex;
   align-items: center;
   justify-content: center;
   box-shadow: 0 4rpx 16rpx rgba(11, 218, 238, 0.3);
}
</style>
