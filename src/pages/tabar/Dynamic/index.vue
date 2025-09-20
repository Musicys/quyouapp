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
      <view class="but"> <wd-icon name="chat" size="22px"></wd-icon> </view>
   </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dynamic from './components/Dynamic.vue';
import Tag from './components/Tag.vue';
const istab = ref(0);
const tab = ref([
   { title: '动态', name: '0' },
   { title: '标签', name: '1' }
]);
const set = e => {
   console.log(e);
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
      top: 0;
      z-index: 1;
      background: #ffe088;
   }
   .zp-page-top {
      z-index: -1 !important;
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
