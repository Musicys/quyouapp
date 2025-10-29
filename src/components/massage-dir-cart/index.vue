<template>
   <view class="dynamic-item">
      <view class="dynamic-header">
         <text class="post-time">{{
            formatTime(item?.updatetime || item?.createTime)
         }}</text>
      </view>
      <view class="dynamic-content">
         <text>{{ safeValue(item?.context, '') }}</text>
      </view>

      <!-- 动态图片 (如果有) -->
      <view class="dynamic-images" v-if="getImages(item?.imgarr).length > 0">
         <image
            v-for="(img, index) in getImages(item?.imgarr)"
            :key="index"
            :src="img || '/static/default-image.png'"
            mode="aspectFill"
            class="dynamic-image"></image>
      </view>

      <!-- 互动按钮 -->
      <view class="interaction-buttons">
         <view class="interaction-btn" @click="handleLike">
            <view
               class="btn-icon like-icon"
               :class="{ liked: item?.isLove === 1 }"></view>
            <text class="btn-text" :class="{ 'liked-text': item?.isLove === 1 }"
               >{{ safeNumber(item?.love, 0) }} 赞</text
            >
         </view>
         <view class="interaction-btn" @click="handleComment">
            <view class="btn-icon comment-icon"></view>
            <text class="btn-text">{{ safeNumber(item?.count, 0) }} 评论</text>
         </view>
         <view class="interaction-btn" @click="handleShare">
            <view class="btn-icon share-icon"></view>
            <text class="btn-text">分享</text>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
   item: {
      type: Object,
      default: () => ({
         email: '2825424566@qq.com',
         id: 113,
         context: '爱你优',
         lat: 28.786364,
         lng: 115.38681,
         imgarr:
            '["https://web-scoke.oss-cn-beijing.aliyuncs.com/2024/61340598739d4736a6d2c5651c9e8bc8fufu.jpg","https://web-scoke.oss-cn-beijing.aliyuncs.com/2024/03424dc598f34f89916376b5a6ea57e9fufu.jpg","https://web-scoke.oss-cn-beijing.aliyuncs.com/2024/a309d602d9c64a46baabcb6e9a411f9bfufu.jpg"]',
         distance: 205599,
         formatted: '205.6km',
         count: 0,
         love: 0,
         userId: 26758,
         userAccount: 'music123',
         username: '时间褶子',
         gender: 1,
         age: 15,
         avatarUrl:
            'https://ts2.tc.mm.bing.net/th/id/OIP-C.WXtLvr1iXhwS6T1mtv9TDgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
         isLove: 0,
         updatetime: '2025-10-17T08:10:04.000+00:00',
         createTime: '2025-10-09T07:19:06.000+00:00',
         login: 1,
         province: '江西',
         district: '萍乡',
         isFocus: '0'
      })
   }
});

// 格式化时间显示
const formatTime = (timeStr: string | null | undefined) => {
   if (!timeStr) return '';

   try {
      const date = new Date(timeStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();

      // 处理无效日期
      if (isNaN(date.getTime())) return '';

      // 小于1分钟
      if (diff < 60 * 1000) {
         return '刚刚';
      }
      // 小于1小时
      else if (diff < 60 * 60 * 1000) {
         return Math.floor(diff / (60 * 1000)) + '分钟前';
      }
      // 小于24小时
      else if (diff < 24 * 60 * 60 * 1000) {
         return Math.floor(diff / (60 * 60 * 1000)) + '小时前';
      }
      // 小于7天
      else if (diff < 7 * 24 * 60 * 60 * 1000) {
         return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前';
      }
      // 超过7天显示日期
      else {
         const year = date.getFullYear();
         const month = (date.getMonth() + 1).toString().padStart(2, '0');
         const day = date.getDate().toString().padStart(2, '0');

         if (year === now.getFullYear()) {
            return `${month}-${day}`;
         } else {
            return `${year}-${month}-${day}`;
         }
      }
   } catch (error) {
      console.error('Failed to format time:', error);
      return '';
   }
};

// 安全地解析图片数组
const getImages = (imgarr: string | null | undefined): string[] => {
   if (!imgarr) return [];
   try {
      const parsed = JSON.parse(imgarr);
      return Array.isArray(parsed) ? parsed : [];
   } catch (error) {
      console.error('Failed to parse image array:', error);
      return [];
   }
};

// 安全获取字符串值
const safeValue = (value: any, defaultValue: string = ''): string => {
   if (value === null || value === undefined) return defaultValue;
   return String(value);
};

// 安全获取数字值
const safeNumber = (value: any, defaultValue: number = 0): number => {
   const num = Number(value);
   return isNaN(num) ? defaultValue : num;
};

// 定义事件
const emit = defineEmits(['like', 'comment', 'share']);

const handleLike = () => {
   if (props.item) {
      emit('like', props.item);
   }
};

const handleComment = () => {
   if (props.item) {
      emit('comment', props.item);
   }
};

const handleShare = () => {
   if (props.item) {
      emit('share', props.item);
   }
};
</script>

<style lang="scss" scoped>
.dynamic-item {
   padding: 25rpx;
   border-bottom: 1rpx solid rgba(0, 0, 0, 0.3);
   margin-bottom: 15rpx;
}

.dynamic-header {
   margin-bottom: 15rpx;
}

.post-time {
   font-size: 24rpx;
   color: #999;
}

.dynamic-content {
   font-size: 28rpx;
   color: #333;
   line-height: 1.6;
   margin-bottom: 20rpx;
}

.dynamic-images {
   margin-bottom: 20rpx;
   display: grid;
   grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
   gap: 15rpx;
}

.dynamic-image {
   width: 100%;
   height: 300rpx;
   border-radius: 15rpx;
}

.interaction-buttons {
   display: flex;
   justify-content: space-around;
   padding-top: 20rpx;
   border-top: 1rpx solid #f5f5f5;
}

.interaction-btn {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 5rpx;
}

.btn-icon {
   width: 40rpx;
   height: 40rpx;
   border-radius: 50%;
   background-color: #f5f5f5;
}

.like-icon {
   background-color: rgba(244, 67, 54, 0.1);
}

.comment-icon {
   background-color: rgba(33, 150, 243, 0.1);
}

.share-icon {
   background-color: rgba(76, 175, 80, 0.1);
}

.btn-text {
   font-size: 24rpx;
   color: #666;
}

.liked {
   background-color: rgba(244, 67, 54, 0.3) !important;
}

.liked-text {
   color: #f44336;
}
</style>
