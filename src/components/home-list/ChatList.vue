<!-- 使用页面滚动示例 -->
<template>
   <!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
   <z-paging
      ref="paging"
      :refresher-enabled="false"
      use-page-scroll
      v-model="dataList"
      @query="queryList">
      <template #top>
         <Navtop></Navtop>
      </template>
      <template #empty>
         <!-- <empty-view /> -->
         <NoData></NoData>
      </template>
      <view class="item" v-for="(item, index) in dataList" :key="index">
         <ChatCart :data="item"></ChatCart>
      </view>

      <template #bottom>
         <NavBottom></NavBottom>
      </template>
   </z-paging>
</template>

<script lang="ts" setup>
import NoData from '@/components/no-data/index.vue';
import ChatCart from '@/components/chat-cart/index.vue';

import { getChatList } from '@/api/chat';
import HomeUserCart from '@/components/home-user-cart/index.vue';
import { throttle } from '@/util/index';
import Navtop from '@/components/nav-top/index.vue';
import NavBottom from '@/components/nav-buttom/index.vue';
const paging = ref(null);

let dataList = ref();

const props = defineProps<{
   data: any;
}>();
const from = ref({});

const queryList = (page, pageSize) => {
   getChatList({
      page: page,
      pageSize: pageSize,
      ...from.value
   }).then(res => {
      if (res.code == 0) {
         paging.value.complete(res.data);
      } else {
         paging.value.complete(false);
      }
   });
};
watch(
   () => props.data,
   newVal => {
      from.value = newVal;
      paging.value?.refresh();
   },
   { immediate: true }
);
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value

// 其他省略
</script>
