<!-- 使用页面滚动示例 -->
<template>
   <!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
   <z-paging ref="paging" v-model="dataList" use-page-scroll @query="queryList">
      <template #top>
         <Navtop />
      </template>
      <template #empty>
         <!-- <empty-view /> -->
         <NoData></NoData>
      </template>
      <view class="item" v-for="(item, index) in dataList" :key="index">
         <view class="item-title">{{ index }}</view>
      </view>

      <template #bottom> </template>
   </z-paging>
</template>

<script lang="ts" setup>
import NoData from '@/components/no-data/index.vue';
import Navtop from '@/components/nav-top/index.vue';
const paging = ref(null);

let dataList = ref();

const queryList = (page, pageSize) => {
   paging.value.complete([1, 2, 3, 4, 4, 5, 6, 7, 8, 5, 9, page, pageSize]);
};
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value

// 其他省略
</script>
