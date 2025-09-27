<!-- 使用页面滚动示例 -->
<template>
   <!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
   <z-paging
      ref="paging"
      :refresher-enabled="false"
      v-model="dataList"
      use-page-scroll
      @query="queryList">
      <template #top>
         <Navtop></Navtop>
      </template>
      <template #empty>
         <!-- <empty-view /> -->
         <NoData></NoData>
      </template>
      <view class="item" v-for="(item, index) in dataList" :key="index">
         <HomeUserCart :data="item"></HomeUserCart>
      </view>

      <template #bottom> </template>
   </z-paging>
</template>

<script lang="ts" setup>
import NoData from '@/components/no-data/index.vue';
import { UserList } from '@/api/system';
import HomeUserCart from '@/components/home-user-cart/index.vue';
import { throttle } from '@/util/index';
import Navtop from '@/components/nav-top/index.vue';
const paging = ref(null);

let dataList = ref();

const queryList = (page, pageSize) => {
   UserList({
      current: page,
      pageSize: pageSize,
      userStatus: 0
   }).then(res => {
      if (res.code == 0) {
         paging.value.complete(res.data.records);
      } else {
         paging.value.complete(false);
      }
   });
};
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value

// 其他省略
</script>
