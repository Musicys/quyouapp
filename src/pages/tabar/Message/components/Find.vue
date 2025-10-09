<template>
   <view class="friend-list-container">
      <view class="friend-list-header">
         <text class="friend-list-title">好友列表</text>
      </view>

      <view class="friend-list" v-if="friendList.length > 0">
         <view
            class="friend-item"
            v-for="friend in friendList"
            :key="friend.id"
            @click="handleFriendClick(friend)">
            <!-- 头像部分 -->
            <view class="avatar-container">
               <image
                  :src="
                     friend.avatarUrl ||
                     `https://via.placeholder.com/100?text=${friend.username?.charAt(0)}`
                  "
                  class="avatar"
                  mode="aspectFill" />
               <view
                  class="online-indicator"
                  :class="{ online: friend.login === 1 }"></view>
            </view>

            <!-- 信息部分 -->
            <view class="friend-info">
               <!-- 第一行：名称、在线状态和时间 -->
               <view class="friend-info-header">
                  <view class="friend-name-container">
                     <text class="friend-name">{{ friend.username }}</text>
                     <text class="online-status" v-if="friend.login === 1"
                        >在线</text
                     >
                  </view>
                  <text class="message-time">{{
                     formatMessageTime(friend.latestMessage?.createtime)
                  }}</text>
               </view>

               <!-- 第二行：最新消息和未读数量 -->
               <view class="friend-info-footer">
                  <text class="latest-message">{{
                     getLatestMessageContent(friend)
                  }}</text>
                  <view class="unread-count" v-if="getUnreadCount(friend) > 0">
                     {{ getUnreadCount(friend) }}
                  </view>
               </view>
            </view>
         </view>
      </view>

      <!-- 空列表状态 -->
      <view class="empty-list" v-else>
         <text>暂无好友</text>
      </view>
   </view>
</template>

<script setup lang="ts">
import { sockeStore } from '@/store/socke';
import { useStore } from '@/store/user';
import { User } from '@/api/user/model/type';
import { useRouter } from 'uni-mini-router';
const router = useRouter();
const user = useStore();
const socke = sockeStore();

// 计算好友列表（直接监听socke的UserList）
const friendList = computed<Friend[]>(() => {
   if (!socke.UserList || socke.UserList.length === 0) {
      return [];
   }

   return socke.UserList.map(friend => ({
      ...friend,
      // 计算最新消息
      latestMessage:
         friend.sendList && friend.sendList.length > 0
            ? friend.sendList[friend.sendList.length - 1]
            : undefined
   }));
});

// 格式化消息时间
const formatMessageTime = (timeString?: string): string => {
   if (!timeString) return '';

   const messageTime = new Date(timeString);
   const now = new Date();
   const diffMs = now.getTime() - messageTime.getTime();
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

   if (diffDays === 0) {
      // 今天，只显示时间
      return messageTime.toLocaleTimeString('zh-CN', {
         hour: '2-digit',
         minute: '2-digit'
      });
   } else if (diffDays < 7) {
      // 一周内
      return `${diffDays}天前`;
   } else if (diffDays < 30) {
      // 一个月内
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
   } else {
      // 一个月以上
      return `${Math.floor(diffDays / 30)}个月前`;
   }
};

// 获取最新消息内容
const getLatestMessageContent = (friend: Friend): string => {
   if (!friend.sendList || friend.sendList.length === 0) {
      return '暂无消息';
   }

   const latestMessage = friend.sendList[friend.sendList.length - 1];
   return latestMessage.context || '';
};

// 获取未读消息数量
const getUnreadCount = (friend: Friend): number => {
   console.log(friend);

   if (!friend.sendList || friend.sendList.length === 0) {
      return 0;
   }

   // 假设yeslook为'0'表示未读
   return friend.sendList.filter(
      msg => msg.yeslook === '0' && msg.sendid == user.userInfo.id
   ).length;
};

// 处理好友点击事件
const handleFriendClick = (friend: Friend) => {
   router.push({ name: 'chat', params: { sendid: friend.id } });
};

// 组件挂载时
onShow(() => {
   paging.value.refresh();
});
</script>

<style lang="scss" scoped>
.friend-list-container {
   width: 100%;
   height: 100%;
   background-color: #f8f8f8;
}

.friend-list-header {
   padding: 20rpx;
   background-color: #fff;
   border-bottom: 1rpx solid #eee;
}

.friend-list-title {
   font-size: 32rpx;
   font-weight: 600;
   color: #333;
}

.friend-list {
   padding-bottom: 20rpx;
}

.friend-item {
   display: flex;
   align-items: center;
   padding: 20rpx;
   background-color: #fff;
   margin-bottom: 10rpx;
   transition: background-color 0.2s;

   &:active {
      background-color: #f5f5f5;
   }
}

.avatar-container {
   position: relative;
   margin-right: 20rpx;
}

.avatar {
   width: 100rpx;
   height: 100rpx;
   border-radius: 50%;
   background-color: #f0f0f0;
}

.online-indicator {
   position: absolute;
   bottom: 0;
   right: 0;
   width: 30rpx;
   height: 30rpx;
   border-radius: 50%;
   border: 3rpx solid #fff;
   background-color: #ccc;

   &.online {
      background-color: #52c41a;
   }
}

.friend-info {
   flex: 1;
   min-width: 0;
}

.friend-info-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 8rpx;
}

.friend-name-container {
   display: flex;
   align-items: center;
}

.friend-name {
   font-size: 32rpx;
   font-weight: 600;
   color: #333;
   margin-right: 10rpx;
}

.online-status {
   font-size: 22rpx;
   color: #52c41a;
   background-color: rgba(82, 196, 26, 0.1);
   padding: 2rpx 10rpx;
   border-radius: 10rpx;
}

.message-time {
   font-size: 22rpx;
   color: #999;
}

.friend-info-footer {
   display: flex;
   justify-content: space-between;
   align-items: center;
}

.latest-message {
   font-size: 26rpx;
   color: #666;
   flex: 1;
   min-width: 0;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
}

.unread-count {
   min-width: 36rpx;
   height: 36rpx;
   line-height: 36rpx;
   text-align: center;
   font-size: 22rpx;
   color: #fff;
   background-color: #ff4d4f;
   border-radius: 18rpx;
   padding: 0 12rpx;
   margin-left: 10rpx;
}

.empty-list {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 300rpx;
   color: #999;
   font-size: 28rpx;
}
</style>
