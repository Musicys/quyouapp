<template>
   <z-paging
      ref="paging"
      :refresher-enabled="false"
      v-model="data"
      :use-safe-area-placeholder="true"
      @query="queryList">
      <template #top> 123 </template>
      <template #empty>
         <!-- <empty-view /> -->
         <NoData></NoData>
      </template>
      <view class="item" v-for="item in data" :key="item.id">
         <FocusCart :data="item"></FocusCart>
      </view>

      <template #bottom> </template>
   </z-paging>
</template>

<script setup lang="ts">
import { myFocusLst } from '@/api/focus';
import { onMounted, reactive } from 'vue';
import NoData from '@/components/no-data/index.vue';
import FocusCart from '@/components/focus-cart/index.vue';
import { FocusUserVo } from '@/api/focus/model/type';

const paging = ref(null);
const sach = ref('');
const data = ref<FocusUserVo[]>();
const queryList = (page, pageSize) => {
   myFocusLst({
      page,
      pageSize,
      sach: sach.value
   }).then(res => {
      if (res.code === 0) {
         paging.value.complete(res.data);
      }
   });
};
onMounted(() => {
   paging.value.refresh();
});
</script>

<style lang="scss" scoped></style>
