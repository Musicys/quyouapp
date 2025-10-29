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
         <LovemyComment :data="item"></LovemyComment>
      </view>

      <template #bottom> </template>
   </z-paging>
</template>

<script setup lang="ts">
import { LovemyCommentList } from '@/api/love';
import { onMounted, reactive } from 'vue';
import NoData from '@/components/no-data/index.vue';
import LovemyComment from './components/LovemyComment.vue';

const paging = ref(null);
const sach = ref('');
const data = ref<DynamicLoveVo[]>();
const queryList = (page, pageSize) => {
   LovemyCommentList({
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
