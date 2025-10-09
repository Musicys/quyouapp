<template>
   <!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
   <z-paging
      ref="paging"
      :refresher-enabled="false"
      v-model="dataList"
      :use-safe-area-placeholder="true"
      @query="queryList">
      <template #top>
         <Navtop></Navtop>
      </template>
      <template #empty>
         <!-- <empty-view /> -->
         <NoData></NoData>
      </template>
      <view class="item" v-for="(item, index) in dataList" :key="index">
         <DynamicCart :dynamic="item"></DynamicCart>
      </view>

      <template #bottom> </template>
   </z-paging>
</template>

<script lang="ts" setup>
import NoData from '@/components/no-data/index.vue';
import { getDynamicList } from '@/api/dynamic';
import { useStore } from '@/store/user';
import Navtop from '@/components/nav-top/index.vue';
import DynamicCart from '@/components/dynamic-cart/index.vue';
import { onShow } from '@dcloudio/uni-app';
const store = useStore();
const paging = ref(null);

let dataList = ref();

const queryList = (page, pageSize) => {
   getDynamicList({
      page,
      pageSize,
      lat: store.userInfo.lat,
      lng: store.userInfo.lng,
      province: ''
   }).then(res => {
      // 模拟请求成功
      if (res.code === 0) {
         paging.value.complete(res.data);
         console.log(res.data.length);
      } else {
         paging.value.complete(false);
      }
   });
};
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value
onShow(() => {
   paging.value.refresh();
});
// 其他省略
</script>
