<template>
   <view class="page">
      <wd-tabs v-model="tab">
         <block v-for="item in tabs" :key="item.value">
            <wd-tab :title="`${item.title}`" :name="item.value">
               <view class="content" v-if="istab == 0"> 123 </view
               ><view class="content" v-if="istab == 1"> 123 </view>
            </wd-tab>
         </block>
      </wd-tabs>
      <view class="but"> <wd-icon name="chat" size="22px"></wd-icon> </view>
   </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const tabs = ref([
   {
      title: '附近',
      value: '0'
   },
   {
      title: '兴趣',
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
      position: fixed;
      top: 0;
      z-index: 1;
      background: #ffe088;
   }
}
.page {
   position: relative;
}
.but {
   position: fixed;

   top: 0;
   z-index: 99;
   right: 15rpx;
}
</style>
