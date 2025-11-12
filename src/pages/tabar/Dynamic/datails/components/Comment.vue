<template>
   <view class="comment-item">
      <!-- 评论主体 -->
      <view class="comment-main">
         <image
            @click.stop="
               router.push({
                  name: 'preinfo',
                  params: { userId: comment.userId }
               })
            "
            class="comment-avatar"
            :src="comment.avatarUrl"
            mode="aspectFill"></image>
         <view class="comment-content">
            <view class="comment-header">
               <text class="comment-username">{{ comment.username }}</text>
               <text class="comment-time">{{ comment.formattedTime }}</text>
               <text class="comment-location" v-if="comment.lat && comment.lng">
                  {{ getLocationText(comment.lat, comment.lng) }}
               </text>
            </view>
            <text class="comment-text">{{ comment.context }}</text>
            <!-- 评论图片 -->
            <view
               class="comment-images"
               v-if="comment.imgarr && JSON.parse(comment.imgarr).length > 0">
               <wd-img
                  v-for="(img, index) in JSON.parse(comment.imgarr)"
                  :key="index"
                  :width="100"
                  :height="100"
                  :src="img.trim()"
                  mode="aspectFill"
                  :enable-preview="true"
                  class="comment-image"></wd-img>
            </view>
            <!-- 评论操作 -->
            <view class="comment-actions">
               <view class="action-btn" @click="handleReply">
                  <tn-icon name="reply-fill" size="36" />
                  <text>回复</text>
               </view>
            </view>
         </view>
      </view>

      <!-- 回复列表 -->
      <view class="reply-list" v-if="comment.chide && comment.chide.length > 0">
         <view class="reply-item" v-for="reply in message" :key="reply.id">
            <image
               @click.stop="
                  router.push({
                     name: 'preinfo',
                     params: { userId: reply.userId }
                  })
               "
               class="reply-avatar"
               :src="reply.avatarUrl"
               mode="aspectFill"></image>
            <div class="reply-content">
               <text class="reply-username">{{ reply.username }}</text>
               <text class="reply-text" v-if="!reply.replyUserId"
                  >: {{ reply.context }}
               </text>
               <text class="reply-text" v-else>
                  回复
                  <text class="reply-target">@{{ props.comment.username }}</text
                  >: {{ reply.context }}
               </text>

               <wd-img
                  v-if="reply.imgarr"
                  :width="100"
                  :height="100"
                  :src="reply.imgarr ? JSON.parse(reply.imgarr)[0] : ''"
                  :enable-preview="true" />
               <text class="reply-time">{{ reply.formattedTime }}</text>
            </div>
         </view>

         <!-- 加载更多回复 -->

         <view
            class="load-more-replies"
            v-if="count > message.length && count > 3"
            @click="handleLoadMore">
            <text>查看更多回复（{{ count - message.length }}）</text>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue';
import { getReplyList } from '@/api/dynamic';
import { useRoute, useRouter } from 'uni-mini-router';
const router = useRouter();

const route = useRoute();
interface Reply {
   id: number;
   userId: number;
   replyId: number;
   replyUserId: number | null;
   context: string;
   imgarr: string | null;
   createTime: string;
   updateTime: string;
   username: string;
   avatarUrl: string;
   lat: number;
   lng: number;
   gender: number;
   count: number;
   formattedTime?: string;
}

interface Comment {
   id: number;
   userId: number;
   replyId: number;
   replyUserId: number | null;
   context: string;
   imgarr: string | null;
   createTime: string;
   updateTime: string;
   username: string;
   avatarUrl: string;
   lat: number;
   lng: number;
   gender: number;
   count: number;
   chide: Reply[];
   formattedTime?: string;
}

const props = defineProps<{
   comment: Comment;
}>();

const count = ref<number>(0);
const emit = defineEmits<{
   loadMoreReplies: [commentId: number, currentReplyCount: number];
   reply: [comment: Comment];
}>();

const message = ref<Reply[]>([]);

// 处理回复数据并确保响应式更新
const processReplies = (replies: Reply[]) => {
   // 深拷贝确保Vue能检测到变化
   return replies.map(reply => ({
      ...reply,
      formattedTime: reply.formattedTime || formatTime(reply.createTime)
   }));
};

// 显示的回复数量：最多3条，超过显示"查看更多"
const displayReplies = () => {
   if (!props.comment.chide || !Array.isArray(props.comment.chide)) {
      message.value = [];
      return;
   }

   // 使用深拷贝处理数据
   const processedReplies = processReplies(props.comment.chide);

   count.value = props.comment.count;
   message.value = processedReplies;
   console.log(count.value);
};

onMounted(() => {
   console.log('组件', props.comment);

   displayReplies();
});

// 单独监听chide数组的变化
watch(
   () => props.comment.chide,
   newChide => {
      message.value = newChide;
   },
   { deep: true }
);
// 单独监听chide数组的变化
watch(
   () => props.comment.count,
   newCount => {
      console.log('newCount', newCount);

      count.value = newCount;
   },
   { deep: true }
);

// 获取位置文本
const getLocationText = (lat: number, lng: number) => {
   // 这里可以根据经纬度获取具体位置信息
   // 简化处理，直接返回经纬度信息
   return `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

// 处理点赞
const handleLike = () => {
   console.log('点赞评论:', props.comment.id);

   // 这里可以调用点赞API
};

// 处理回复
const handleReply = () => {
   // 触发父组件的回复事件
   emit('reply', props.comment);
   nextTick(() => {
      console.log('现在的数据', props.comment);
   });
};

// 处理回复点赞
const handleReplyLike = (replyId: number) => {
   console.log('点赞回复:', replyId);
   // 这里可以调用点赞API
};

// 处理回复的回复
const handleReplyToReply = (reply: Reply) => {
   console.log('回复这条回复:', reply.id);
   // 实际项目中应该触发回复输入框聚焦等操作
};
// 格式化时间
const formatTime = (timeString: string) => {
   const time = new Date(timeString);
   const now = new Date();
   const diff = now.getTime() - time.getTime();

   const minutes = Math.floor(diff / 60000);
   const hours = Math.floor(diff / 3600000);
   const days = Math.floor(diff / 86400000);

   if (minutes < 1) return '刚刚';
   if (minutes < 60) return `${minutes}分钟前`;
   if (hours < 24) return `${hours}小时前`;
   if (days < 7) return `${days}天前`;

   return `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')}`;
};

// 加载更多回复
const handleLoadMore = async () => {
   if (props.comment.count > 3) {
      try {
         const res = await getReplyList({
            commentsId: props.comment.id,
            page: Math.floor(message.value.length / 10) + 1,
            pageSize: 10,
            replyId: Number(route.query.dynamicId),
            type: 2
         });

         if (res.code === 0 && res.data) {
            if (!message.value) {
               message.value = [];
            }
            const formattedReplies = res.data.map((reply: any) => ({
               ...reply,
               formattedTime: formatTime(reply.createTime)
            }));
            if (Math.floor(message.value.length / 10) + 1 == 1) {
               // 处理回复的时间格式化

               message.value = [...formattedReplies];
            } else {
               // 处理回复的时间格式化

               message.value.push(...formattedReplies);
            }
         }
      } catch (error) {
         console.error('加载更多回复失败:', error);
      }
   }
};
</script>

<style lang="scss" scoped>
.comment-item {
   margin-bottom: 30rpx;
   position: relative;
}

/* 评论主体 */
.comment-main {
   display: flex;
   gap: 20rpx;
   padding-right: 20rpx;
}

.comment-avatar {
   width: 80rpx;
   height: 80rpx;
   border-radius: 50%;
   flex-shrink: 0;
}

.comment-content {
   flex: 1;
}

.comment-header {
   display: flex;
   align-items: center;
   gap: 10rpx;
   margin-bottom: 10rpx;
   flex-wrap: wrap;
}

.comment-username {
   font-size: 26rpx;
   font-weight: bold;
   color: #000;
}

.comment-time {
   font-size: 22rpx;
   color: #999;
}

.comment-location {
   font-size: 22rpx;
   color: #0bdaee;
   flex: 1;
}

.comment-text {
   font-size: 28rpx;
   color: #333;
   line-height: 42rpx;
   margin-bottom: 10rpx;
   word-break: break-all;
}

.comment-images {
   display: flex;
   gap: 10rpx;
   margin-bottom: 10rpx;
   flex-wrap: wrap;
}

.comment-image {
   width: 160rpx;
   height: 160rpx;
   border-radius: 10rpx;
}

.comment-actions {
   display: flex;
   gap: 30rpx;
   padding: 10rpx 0;
}

.action-btn {
   display: flex;
   align-items: center;
   gap: 6rpx;
   font-size: 24rpx;
   color: #666;
}

/* 回复列表 */
.reply-list {
   margin-left: 80rpx;
   padding-top: 20rpx;
   border-left: 2rpx solid #f0f0f0;
   padding-left: 30rpx;
}

.reply-item {
   background-color: #f9f9f9;
   border-radius: 15rpx;
   padding: 20rpx;
   margin-bottom: 15rpx;
   position: relative;
   display: flex;
   gap: 15rpx;
}

.reply-item::before {
   content: '';
   position: absolute;
   left: -22rpx;
   top: 25rpx;
   width: 16rpx;
   height: 16rpx;
   background-color: #f9f9f9;
   border-radius: 50%;
}

.reply-avatar {
   width: 60rpx;
   height: 60rpx;
   border-radius: 50%;
   flex-shrink: 0;
}

.reply-content {
   flex: 1;
}

.reply-username {
   font-size: 24rpx;
   font-weight: bold;
   color: #000;
}

.reply-text {
   font-size: 24rpx;
   color: #333;
   line-height: 36rpx;
   margin: 10rpx 0;
   display: block;
}

.reply-target {
   color: #0bdaee;
}

.reply-time {
   font-size: 20rpx;
   color: #999;
   display: block;
   margin-bottom: 10rpx;
}

.reply-actions {
   display: flex;
   gap: 20rpx;
}

/* 加载更多回复 */
.load-more-replies {
   text-align: center;
   padding: 15rpx;
   font-size: 24rpx;
   color: #0bdaee;
   background-color: #f0f0f0;
   border-radius: 20rpx;
   margin-top: 10rpx;
}
</style>
