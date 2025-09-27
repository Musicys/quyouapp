<template>
   <view class="user-card">
      <!-- 左侧头像区域 -->
      <view class="avatar-container">
         <image
            :src="data.avatarUrl"
            mode="aspectFill"
            class="avatar"
            :alt="data.username"></image>
         <!-- 在线状态指示器 -->
         <view
            class="online-indicator"
            :class="{ online: data.login === 1 }"></view>
      </view>

      <!-- 右侧信息区域 -->
      <view class="info-container">
         <!-- 第一行：名称和在线状态 -->
         <vue class="top">
            <view class="first-line">
               <view class="box">
                  <text class="username">{{ data.username }}</text>
                  <text class="online-status">
                     {{ data.login === 1 ? '在线' : '昨天在线' }}
                  </text>
               </view>
               <!-- 右侧操作按钮 -->
               <wd-button plain size="small" class="btn-text">发消息</wd-button>
            </view>

            <!-- 第二行：年龄和地区 -->
            <view class="second-line">
               <text class="age">{{ data.age }}岁</text>
               <text class="separator">·</text>
               <text class="location"
                  >{{ data.province }} {{ data.district }}</text
               >
            </view>

            <!-- 第三行：个人描述 -->
            <view class="third-line">
               <text class="intro">{{ data.introductory }}</text>
            </view>
         </vue>
         <!-- 图片展示区 -->
         <view v-if="imageList.length" class="images-container">
            <image
               v-for="(img, index) in imageList"
               :key="index"
               :src="img"
               mode="aspectFill"
               class="image-item"
               :alt="'用户上传图片 ' + (index + 1)"></image>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { User } from '@/api/user/model/type';
// 接收父组件传递的用户数据
const props = defineProps<{
   data: User;
}>();

// 解析图片数组
const imageList = computed(() => {
   try {
      return JSON.parse(props.data.imagsarr) as string[];
   } catch (e) {
      return [];
   }
});
</script>

<style lang="scss" scoped>
.user-card {
   display: flex;
   align-items: self-start;
   padding: 12rpx 24rpx;
   justify-content: start;

   border-bottom: 1px solid #f5f5f5;

   // 头像容器
   .avatar-container {
      position: relative;
      margin-right: 20rpx;

      .avatar {
         width: 120rpx;
         height: 120rpx;
         border-radius: 50%;
      }

      // 在线状态指示器
      .online-indicator {
         position: absolute;
         right: 0;
         bottom: 0;
         width: 30rpx;
         height: 30rpx;
         border-radius: 50%;
         background-color: #ddd;
         border: 4rpx solid #fff;

         &.online {
            background-color: #00c853;
         }
      }
   }
   .top {
      height: 120rpx;
      margin-bottom: 2em;
   }
   // 信息容器
   .info-container {
      flex: 1;
      min-width: 0; // 解决文本溢出问题
      display: flex;
      flex-direction: column;
      justify-content: center;

      .first-line {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 8rpx;

         .username {
            font-size: 34rpx;
            font-weight: 600;
            color: #333;
         }

         .online-status {
            font-size: 18rpx;
            color: #888;
            margin-left: 1em;
         }
      }

      .second-line {
         display: flex;
         align-items: center;
         margin-bottom: 8rpx;

         .age,
         .location {
            font-size: 28rpx;
            color: #666;
         }

         .separator {
            margin: 0 10rpx;
            color: #ccc;
         }
      }

      .third-line {
         margin-bottom: 10rpx;

         .intro {
            font-size: 28rpx;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            width: 100%;
         }
      }

      // 图片容器
      .images-container {
         display: flex;
         gap: 10rpx;

         .image-item {
            width: 33%;

            border-radius: 8rpx;
         }
      }
   }

   // 操作按钮容器
   .action-container {
      margin-left: 20rpx;

      .message-btn {
         width: 140rpx;
         height: 60rpx;
         line-height: 60rpx;
         background-color: #07c160;
         color: #fff;
         border-radius: 30rpx;
         font-size: 28rpx;
         padding: 0;
         display: flex;
         align-items: center;
         justify-content: center;

         &::after {
            border: none;
         }
      }
   }
}
</style>
