<template>
   <view class="chat-cart-container" @click="handleViewGroupChat">
      <!-- 群聊头像 -->
      <image
         :src="localData.url || ''"
         mode="aspectFill"
         class="chat-avatar"
         @click.stop="handleViewGroupChat" />

      <!-- 群聊信息 -->
      <view class="chat-info">
         <!-- 群聊名称和标签 -->
         <view class="top-section">
            <text class="chat-name">{{ localData.chatName || '群聊' }}</text>
            <view class="tags-container" v-if="parsedTags.length > 0">
               <text
                  v-for="(tag, index) in parsedTags"
                  :key="index"
                  class="tag"
                  @click.stop="handleTagClick(tag)">
                  #{{ tag }}
               </text>
            </view>
         </view>

         <!-- 群聊简介 -->
         <text class="introductory">{{ localData.introductory || '' }}</text>

         <!-- 群聊人数 -->
         <text class="count-text">群成员: {{ localData.count || 0 }}人</text>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
         <button
            v-if="localData.isAdd === 0"
            class="join-button"
            @click.stop="handleJoinGroup">
            <text class="join-button-text">加入</text>
         </button>
         <button v-else class="joined-button" @click.stop="handleViewGroupChat">
            <text class="joined-button-text">已加入</text>
         </button>
      </view>
   </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { sockeStore } from '@/store/socke';
import { useStore } from '@/store/user';
import router from '@/router';
const { userInfo } = useStore();
const { send } = sockeStore();
interface GroupChatData {
   id: number;
   userId: number;
   chatName: string;
   url: string;
   tagName: string;
   introductory: string;
   count: number;
   isAdd: number;
}

const props = defineProps<{
   data: GroupChatData;
}>();

// 创建本地响应式数据副本，符合单向数据流
const localData = ref<GroupChatData>({ ...props.data });

// 监听props变化，更新本地数据
watch(
   () => props.data,
   newData => {
      localData.value = { ...newData };
   },
   { deep: true }
);

// 计算属性：解析标签数组
const parsedTags = computed(() => {
   if (!localData.value.tagName || localData.value.tagName.trim() === '') {
      return [];
   }

   try {
      // 尝试解析JSON字符串
      const tags = JSON.parse(localData.value.tagName);
      return Array.isArray(tags) ? tags : [];
   } catch (e) {
      // 如果解析失败，返回空数组
      return [];
   }
});

// 查看群聊详情
const handleViewGroupChat = () => {
   setTimeout(() => {
      router.push({
         name: 'groupchat',
         params: { groupId: localData.value.id }
      });
   }, 1000);
};

// 加入群聊
const handleJoinGroup = () => {
   if (localData.value.IsAdd == 1) {
      router.push({
         name: 'groupchat',
         params: { groupId: localData.value.id }
      });
   } else {
      send(
         JSON.stringify({
            id: userInfo.id,
            type: 6,
            sendid: null,
            sendteam: localData.value.id,
            context: '',
            sendTime: new Date()
         })
      );
      localData.value.IsAdd = 1;
      setTimeout(() => {
         router.push({
            name: 'groupchat',
            params: { groupId: localData.value.id }
         });
      }, 1000);
   }
};
// 点击标签
const handleTagClick = (tag: string) => {
   // 可以根据标签进行搜索或其他操作
   console.log('Tag clicked:', tag);
};
</script>

<style lang="scss" scoped>
.chat-cart-container {
   display: flex;
   align-items: center;
   padding: 24rpx;
   background-color: #ffffff;
   border-bottom: 1rpx solid #f0f0f0;
   transition: background-color 0.2s;

   &:active {
      background-color: #f8f8f8;
   }
}

/* 群聊头像 */
.chat-avatar {
   width: 100rpx;
   height: 100rpx;
   border-radius: 20rpx;
   margin-right: 20rpx;
   background-color: #f5f5f5;
   flex-shrink: 0;
}

/* 群聊信息 */
.chat-info {
   flex: 1;
   min-width: 0;
   margin-right: 20rpx;
}

/* 顶部区域 */
.top-section {
   display: flex;
   align-items: center;
   margin-bottom: 12rpx;
   flex-wrap: wrap;
}

/* 群聊名称 */
.chat-name {
   font-size: 32rpx;
   font-weight: 500;
   color: #333333;
   margin-right: 12rpx;
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
}

/* 标签容器 */
.tags-container {
   display: flex;
   flex-wrap: wrap;
}

.tag {
   font-size: 22rpx;
   color: #999999;
   background-color: #f5f5f5;
   padding: 4rpx 16rpx;
   border-radius: 16rpx;
   margin-right: 8rpx;
   margin-bottom: 8rpx;
}

/* 群聊简介 */
.introductory {
   font-size: 26rpx;
   color: #666666;
   line-height: 38rpx;
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
   margin-bottom: 8rpx;
}

/* 群聊人数 */
.count-text {
   font-size: 24rpx;
   color: #999999;
}

/* 操作区域 */
.action-section {
   flex-shrink: 0;
}

/* 加入按钮 */
.join-button {
   width: 120rpx;
   height: 68rpx;
   line-height: 68rpx;
   text-align: center;
   background-color: #ff6b81;
   color: #ffffff;
   border-radius: 34rpx;
   font-size: 28rpx;
   border: none;
   padding: 0;
   box-shadow: 0 4rpx 12rpx rgba(255, 107, 129, 0.3);
   transition: all 0.2s;

   &:active {
      transform: scale(0.95);
      opacity: 0.9;
   }
}

.join-button-text {
   color: #ffffff;
   font-weight: 500;
}

/* 已加入按钮 */
.joined-button {
   width: 120rpx;
   height: 68rpx;
   line-height: 68rpx;
   text-align: center;
   background-color: #f5f5f5;
   color: #666666;
   border-radius: 34rpx;
   font-size: 28rpx;
   border: none;
   padding: 0;
   transition: all 0.2s;

   &:active {
      transform: scale(0.95);
      background-color: #eeeeee;
   }
}

.joined-button-text {
   color: #666666;
}

/* 响应式设计 */
@media screen and (max-width: 375px) {
   .chat-cart-container {
      padding: 20rpx;
   }

   .chat-avatar {
      width: 90rpx;
      height: 90rpx;
      border-radius: 18rpx;
   }

   .chat-name {
      font-size: 30rpx;
   }

   .introductory {
      font-size: 24rpx;
      line-height: 36rpx;
   }

   .join-button,
   .joined-button {
      width: 110rpx;
      height: 62rpx;
      line-height: 62rpx;
      font-size: 26rpx;
   }
}
</style>
