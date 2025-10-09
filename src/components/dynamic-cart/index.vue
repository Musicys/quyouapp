<template>
   <view class="dynamic-card">
      <!-- 头像区域 -->
      <view class="avatar-container">
         <view class="box">
            <image
               class="avatar"
               :src="dynamic.avatarUrl"
               mode="widthFix"
               alt="用户头像"></image>
            <!-- 在线状态绿圈 -->
            <view v-if="dynamic.login === 1" class="online-status"></view>
         </view>
      </view>

      <!-- 内容区域 -->
      <view class="content-container">
         <!-- 第一行：用户信息和关注按钮 -->
         <view class="user-info-row">
            <view class="user-info">
               <view class="top">
                  <text class="username">{{ dynamic.username }}</text>
                  <text class="ip-location"> IP: {{ dynamic.province }} </text>
                  <text class="location">
                     {{ dynamic.district }}
                  </text>
                  <text class="same-city" v-if="isSameCity"> (同城) </text>
               </view>
               <view class="time"> {{ formattedTime }} </view>
            </view>
            <wd-button plain size="small">
               {{ dynamic.isFollowed ? '已关注' : '关注' }}</wd-button
            >
         </view>

         <!-- 第二行：动态内容 -->
         <view class="dynamic-content">
            <text>{{ dynamic.context }}</text>
         </view>

         <!-- 第三行：图片展示 -->
         <view class="images-container" v-if="imageList.length > 0">
            <view
               class="image-item"
               v-for="(img, index) in imageList"
               :key="index">
               <image
                  :src="img"
                  mode="widthFix"
                  class="dynamic-image"
                  alt="动态图片"></image>
            </view>
         </view>

         <!-- 底部：互动区域 -->
         <view class="action-bar">
            <view class="action-item chat-btn" @click.stop="handleChat">
               <wd-icon name="chat-o" size="22"></wd-icon>
               <text class="action-text">私聊</text>
            </view>
            <template v-if="dynamic.formatted">
               <wd-icon name="location" size="20"></wd-icon>
               <text>{{ dynamic.formatted }}</text></template
            >

            <view class="distance">
               <view class="action-item like-btn" @click.stop="handleLike">
                  <wd-icon name="heart" size="22px"></wd-icon>
                  <text class="action-text">{{ dynamic.love }}</text>
               </view>
               <view
                  class="action-item comment-btn"
                  @click.stop="handleComment">
                  <wd-icon name="heart" size="22px"></wd-icon>
                  <text class="action-text">{{ dynamic.count }}</text>
               </view>
            </view>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { useStore } from '@/store/user';
import { Dynamic } from '@/api/dynamic/model/type';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();

const props = defineProps<{
   dynamic: Dynamic;
}>();

// 处理图片字符串转数组（解析JSON字符串）
const imageList = computed(() => {
   if (!props.dynamic.imgarr) return [];
   try {
      const images = JSON.parse(props.dynamic.imgarr);

      return Array.isArray(images) ? images : [];
   } catch (e) {
      return [];
   }
});

// 判断是否同城
const isSameCity = computed(() => {
   // 从store中获取当前用户信息
   const currentUser: CurrentUser = store.userInfo;
   // 比较动态发布者地区和当前用户地区
   return currentUser?.province && props.dynamic.province
      ? currentUser.province === props.dynamic.province
      : false;
});

// 关注/取消关注
const handleFollow = () => {
   console.log(
      `点击${props.dynamic.isFollowed ? '取消关注' : '关注'}: ${props.dynamic.userAccount}`
   );
   // 实际项目中会通过emit通知父组件更新状态
   // context.emit('toggleFollow', props.dynamic.userId);
};

// 私聊
const handleChat = () => {
   console.log(`开始私聊: ${props.dynamic.userAccount}`);
   // 实际项目中会跳转到聊天页面
   // uni.navigateTo({ url: `/pages/chat?userId=${props.dynamic.userId}` });
};

// 点赞
const handleLike = () => {
   console.log(`点赞动态: ${props.dynamic.id}`);
   // 实际项目中会调用点赞API
};

// 评论
const handleComment = () => {
   router.push({
      path: '/pages/tabar/dynamic/datails/index',
      query: {
         dynamicId: props.dynamic.id
      }
   });
   // 实际项目中会跳转到评论页面或弹出评论框
};

// 格式化时间
const formattedTime = computed(() => {
   if (!props.dynamic.createTime) return '';

   // 解析时间字符串为Date对象
   const createTime = new Date(props.dynamic.createTime);
   const now = new Date();
   const diffInSeconds = Math.floor(
      (now.getTime() - createTime.getTime()) / 1000
   );

   // 判断时间差
   if (diffInSeconds < 60) {
      // 小于1分钟
      return '刚刚';
   } else if (diffInSeconds < 3600) {
      // 小于1小时
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}分钟前`;
   } else if (diffInSeconds < 86400) {
      // 小于24小时
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}小时前`;
   } else {
      // 24小时及以上，显示年月日
      const year = createTime.getFullYear();
      const month = String(createTime.getMonth() + 1).padStart(2, '0');
      const day = String(createTime.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
   }
});
</script>

<style lang="scss" scoped>
.dynamic-card {
   display: flex;
   padding: 16rpx;
   border-bottom: 1px solid #f5f5f5;
   background-color: #fff;
   &:last-child {
      border-bottom: none;
   }

   .avatar-container {
      margin-right: 16rpx;
      flex-shrink: 0;
      position: relative;
      .box {
         position: relative;
      }
      .avatar {
         width: 80rpx;
         height: 80rpx;
         border-radius: 50%;
         object-fit: cover;
         border: 1px solid rgba($color: #000000, $alpha: 0.3);
      }

      .online-status {
         position: absolute;
         bottom: 6rpx;
         right: 5rpx;
         width: 24rpx;
         height: 24rpx;
         background-color: #2cbe50;
         border: 3rpx solid #fff;
         border-radius: 50%;
         box-shadow: 0 0 0 2rpx rgba(44, 190, 80, 0.2);
      }
   }

   .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;

      .user-info-row {
         display: flex;
         justify-content: space-between;
         align-items: center;

         height: 80rpx;

         .user-info {
            display: flex;
            flex-wrap: wrap;
            gap: 8rpx 12rpx;
            align-items: start;
            flex-direction: column;

            .username {
               font-size: 28rpx;
               font-weight: 600;
               color: #333;
            }

            .ip-location,
            .location {
               font-size: 22rpx;
               color: #999;
            }

            .same-city {
               font-size: 22rpx;
               color: #2cbe50;
               background-color: rgba(44, 190, 80, 0.1);
               padding: 2rpx 8rpx;
               border-radius: 10rpx;
            }
            .time {
               font-size: 20rpx;
               color: #918b8b;
            }
         }
      }

      .dynamic-content {
         margin-top: 0.5em;
         font-size: 26rpx;
         color: #333;
         margin-bottom: 16rpx;
         line-height: 1.5;
         word-break: break-all;
      }

      .images-container {
         display: grid;
         grid-template-columns: repeat(3, 1fr);

         gap: 8rpx;
         margin-bottom: 16rpx;

         .image-item {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 4rpx;

            .dynamic-image {
               width: 100%;
               height: 100%;
               border-radius: 8rpx;
               display: block;
            }
         }
      }

      .action-bar {
         display: flex;
         align-items: center;
         color: #666;
         font-size: 24rpx;
         margin-top: 8rpx;

         .action-item {
            display: flex;
            align-items: center;
            margin-right: 32rpx;
            cursor: pointer;
            padding: 4rpx 0;

            :deep(.wd-icon) {
               margin-right: 6rpx;
               font-size: 26rpx;
            }

            &:active {
               color: #007aff;
            }
         }

         .distance {
            margin-left: auto;
            display: flex;
            align-items: center;
            color: #999;
            font-size: 22rpx;

            :deep(.wd-icon) {
               margin-right: 4rpx;
               font-size: 22rpx;
            }
         }
      }
   }
}
</style>
