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
         <DynamicCart :dynamic="item"></DynamicCart>
      </view>

      <template #bottom>
         <NavBottom></NavBottom>
      </template>
   </z-paging>
</template>

<script lang="ts" setup>
import NoData from '@/components/no-data/index.vue';
import Navtop from '@/components/nav-top/index.vue';
import DynamicCart from '@/components/dynamic-cart/index.vue';
import { focusdrslst } from '@/api/focus';
import NavBottom from '@/components/nav-buttom/index.vue';
const paging = ref(null);

let dataList = ref();

const queryList = (page, pageSize) => {
   focusdrslst({
      page,
      pageSize,
      sach: ''
   }).then(res => {
      // 模拟请求成功
      if (res.code === 0) {
         paging.value.complete(res.data);
      } else {
         paging.value.complete(false);
      }
   });
};
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value
onShow(() => {
   paging.value?.refresh();
});
// 其他省略
</script>
