<template>
   <view class="page">
      <wd-tabs v-model="tab" swipeable>
         <block v-for="item in tabs" :key="item.value">
            <wd-tab :title="`${item.title}`" :name="item.value">
               <view class="content" v-show="tab == 0"> <Find></Find> </view
               ><view class="content" v-show="tab == 1">
                  <Group></Group>
               </view>
            </wd-tab>
         </block>
      </wd-tabs>
      <view class="but"> <wd-icon name="chat" size="22px"></wd-icon> </view>
   </view>
</template>

<script setup lang="ts">
import Find from './components/Find.vue';
import Group from './components/Group.vue';

const tabs = ref([
   {
      title: '消息',
      value: '0'
   },
   {
      title: '群聊',
      value: '1'
   }
]);
const tab = ref(0);
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
      z-index: 1;
      background: $quyou-nav-bg-color;
      height: $quyou-nav-height;
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
</style>
