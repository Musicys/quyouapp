<!-- 使用页面滚动示例 -->
<template>
   <!-- 此时使用了页面的滚动，z-paging不需要有确定的高度，use-page-scroll需要设置为true -->
   <z-paging
      ref="pagingAlluser"
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
import { reactive, watch } from 'vue';
const pagingAlluser = ref(null);

let dataList = ref();
const props = defineProps<{
   data: any;
}>();
const from = ref({});

const loding = ref<boolean>(false);
const queryList = (page, pageSize) => {
   if (loding.value) return;

   loding.value = true;
   UserList({
      current: page,
      pageSize: pageSize,
      userStatus: 0,
      ...from.value
   })
      .then(res => {
         loding.value = false;
         if (res.code == 0) {
            pagingAlluser.value.complete(res.data.records);
         } else {
            pagingAlluser.value.complete(false);
         }
      })
      .finally(() => {});
};
watch(
   () => props.data,
   newVal => {
      from.value = newVal;
      pagingAlluser.value?.refresh();
   },
   { immediate: true }
);
// 类似mixins，如果是页面滚动务必要写这一行，并传入当前ref绑定的paging，注意此处是paging，而非paging.value
onShow(() => {
   pagingAlluser.value?.refresh();
});
// 其他省略
</script>
