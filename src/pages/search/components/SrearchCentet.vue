<template>
   <wd-tabs v-model="tab" swipeable sticky>
      <block v-for="item in tabs" :key="item.value">
         <wd-tab :title="`${item.title}`" :name="item.value">
            <view class="content" v-if="tab == 0">
               <Alluser :data="fromAlluser"></Alluser> </view
            ><view class="content" v-if="tab == 1">
               <Dicuser :data="fromDicuser"></Dicuser>
            </view>
            <view class="content" v-if="tab == 2">
               <GroupList :data="fromGroupList"></GroupList
            ></view>
            <view class="content" v-if="tab == 3">
               <ChatList :data="fromChatList"></ChatList>
            </view>
         </wd-tab>
      </block>
   </wd-tabs>
</template>

<script setup lang="ts">
import Alluser from '@/components/home-list/Alluser.vue';
import Dicuser from '@/components/home-list/Dicuser.vue';
import ChatList from '@/components/home-list/ChatList.vue';

import { watch } from 'vue';
const tabs = ref([
   { title: '综合', value: '0' },
   { title: '用户', value: '1' },
   { title: '动态', value: '2' },
   { title: '趣味群', value: '3' }
]);
const tab = ref(0);
const props = defineProps({
   data: {
      type: Object,
      default: () => {
         return {};
      }
   }
});
const datalsit = ref([]);
watch(
   () => props.data,
   newVal => {
      datalsit.value = newVal;
      console.log('值改变了');
   }
);
onMounted(() => {
   datalsit.value = props.data;
});
</script>

<style lang="scss" scoped></style>
