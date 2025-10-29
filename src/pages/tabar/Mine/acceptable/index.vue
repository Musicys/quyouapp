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
         <DynamicLove :data="item"></DynamicLove>
      </view>

      <template #bottom> </template>
   </z-paging>
</template>

<script setup lang="ts">
import { LovemygoodList } from '@/api/love';
import { onMounted, reactive } from 'vue';
import NoData from '@/components/no-data/index.vue';
import DynamicLove from './components/DynamicLove.vue';

const paging = ref(null);
const sach = ref('');
const data = ref<DynamicLoveVo[]>();
const queryList = (page, pageSize) => {
   LovemygoodList({
      page,
      pageSize
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
