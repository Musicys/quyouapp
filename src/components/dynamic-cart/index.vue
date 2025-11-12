<template>
   <view class="dynamic-card">
      <!-- 头像区域 -->

      <view
         class="avatar-container"
         @click.stop="
            router.push({
               name: 'preinfo',
               params: { userId: localDynamic.userId }
            })
         ">
         <view class="box">
            <image
               class="avatar"
               :src="localDynamic.avatarUrl"
               mode="widthFix"
               alt="用户头像"></image>
            <!-- 在线状态绿圈 -->
            <view v-if="localDynamic.login === 1" class="online-status"></view>
         </view>
      </view>

      <!-- 内容区域 -->
      <view class="content-container">
         <!-- 第一行：用户信息和关注按钮 -->
         <view @click="handleComment" class="user-info-row">
            <view class="user-info">
               <view class="top">
                  <tn-icon
                     :name="
                        localDynamic.gender === 1 ? 'sex-male' : 'sex-female'
                     "
                     size="36"
                     :color="localDynamic.gender === 1 ? '#4caf50' : '#f44336'"
                     bold />
                  <text class="username !ml-1 !mr-1">{{
                     localDynamic.username
                  }}</text>
                  <template v-if="genderText || localDynamic.age">
                     <text class="user-info-item !mr-1">
                        {{ localDynamic.age ? localDynamic.age + '岁' : '' }}
                     </text>
                  </template>
                  <text class="ip-location" v-if="localDynamic.province">
                     IP: {{ localDynamic.province }}
                  </text>
                  <text class="location" v-if="localDynamic.district">
                     {{ localDynamic.district }}
                  </text>
                  <text class="same-city" v-if="isSameCity"> (同城) </text>
               </view>
               <view class="time"> {{ formattedTime }} </view>
            </view>
            <wd-button
               plain
               size="small"
               :disabled="isOwnDynamic"
               @click.stop="handleFollow"
               :custom-class="{ disabled: isOwnDynamic }"
               :loading="isFollowing">
               {{
                  isOwnDynamic
                     ? '自己'
                     : localDynamic.isFocus === '1'
                       ? '已关注'
                       : '关注'
               }}</wd-button
            >
         </view>

         <!-- 第二行：动态内容 -->
         <view @click="handleComment" class="dynamic-content">
            <text>{{ localDynamic.context }}</text>
         </view>

         <!-- 第三行：图片展示 -->
         <view class="images-container" v-if="imageList.length > 0">
            <tn-photo-album :data="imageList" :column="3" max="9" />
         </view>

         <!-- 底部：互动区域 -->
         <view class="action-bar">
            <template v-if="localDynamic.formatted && IsShowAddress">
               <wd-icon name="location" size="20"></wd-icon>
               <text>{{ localDynamic.formatted }}</text></template
            >

            <view class="distance">
               <view
                  class="action-item like-btn"
                  @click.stop="handleLike"
                  :class="{ liked: localDynamic.isLove === 1 }">
                  <tn-icon
                     :name="localDynamic.isLove === 1 ? 'like-fill' : 'like'"
                     size="36"
                     bold />
                  <text class="action-text">{{ localDynamic.love }}</text>
               </view>
               <view
                  class="action-item comment-btn"
                  @click.stop="handleComment">
                  <tn-icon name="message" size="36" bold />
                  <text class="action-text">{{ localDynamic.count }}</text>
               </view>
               <view
                  v-if="!isOwnDynamic"
                  class="action-item chat-btn"
                  @click="addFriend">
                  <tn-icon name="reply" size="36" bold />
                  <text class="action-text">打招呼</text>
               </view>
            </view>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { useStore } from '@/store/user';
import { Dynamic } from '@/api/dynamic/model/type';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'uni-mini-router';
import { FocusAdd, FocusDel } from '@/api/focus';
import { LoveAdd, LoveDel } from '@/api/love';
import { sockeStore } from '@/store/socke';
const router = useRouter();
const store = useStore();
const { send, IsFriend } = sockeStore();

//是否显示地址
const IsShowAddress = computed(() => {
   return store.userInfo?.lat ? true : false;
});
// 定义当前用户类型
interface CurrentUser {
   province?: string;
   [key: string]: any;
}

const props = defineProps<{
   dynamic: Dynamic;
}>();

const emit = defineEmits<{
   'update:dynamic': [value: Dynamic];
}>();

// 状态管理
const isFollowing = ref(false);
const isLiking = ref(false);

// 创建本地响应式数据副本，避免直接操作props
const localDynamic = ref<Dynamic>({ ...props.dynamic });
//私聊
const addFriend = () => {
   const isFriend = IsFriend(localDynamic.value.userId);
   if (isFriend) {
      router.push({
         name: 'chat',
         params: { sendid: localDynamic.value.userId }
      });
   } else {
      send(
         JSON.stringify({
            id: store.userInfo.id,
            type: 4,
            sendid: localDynamic.value.userId,
            sendteam: null,
            context: '你好啊，我们开始聊天把-.-',
            sendTime: new Date()
         })
      );
      setTimeout(() => {
         router.push({
            name: 'chat',
            params: { sendid: localDynamic.value.userId }
         });
      }, 500);
   }
};

onMounted(() => {});
// 监听props变化，更新本地副本
watch(
   () => props.dynamic,
   newVal => {
      localDynamic.value = { ...newVal };
   },
   { deep: true }
);

// 处理图片字符串转数组（解析JSON字符串）
const imageList = computed(() => {
   if (!localDynamic.value.imgarr) return [];
   try {
      const images =
         typeof localDynamic.value.imgarr === 'string'
            ? JSON.parse(localDynamic.value.imgarr)
            : localDynamic.value.imgarr;

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
   return currentUser?.province && localDynamic.value.province
      ? currentUser.province === localDynamic.value.province
      : false;
});

// 性别显示文本
const genderText = computed(() => {
   return localDynamic.value.gender === 1
      ? '男'
      : localDynamic.value.gender === 0
        ? '女'
        : '';
});

// 判断是否是自己发布的动态
const isOwnDynamic = computed(() => {
   return store.userInfo?.id === localDynamic.value.userId;
});

// 关注/取消关注
const handleFollow = async () => {
   // 如果是自己发布的动态，不执行任何操作
   if (isOwnDynamic.value || isFollowing.value) return;

   try {
      isFollowing.value = true;
      const isFocus = localDynamic.value.isFocus === '1';
      console.log(
         `${isFocus ? '取消关注' : '关注'}用户: ${localDynamic.value.userAccount}`
      );

      // 调用对应的API
      const result = isFocus
         ? await FocusDel({ focusUserId: localDynamic.value.userId })
         : await FocusAdd({ focusUserId: localDynamic.value.userId });

      // 操作成功后先更新本地状态，然后通知父组件
      if (result.code === 0) {
         // 更新本地状态
         localDynamic.value = {
            ...localDynamic.value,
            isFocus: isFocus ? '0' : '1'
         };
         // 通知父组件
         emit('update:dynamic', { ...localDynamic.value });
      } else {
         uni.showToast({
            title: result.msg || (isFocus ? '取消关注失败' : '关注失败'),
            icon: 'none'
         });
      }
   } catch (error) {
      console.error('关注/取消关注失败:', error);
      uni.showToast({ title: '网络错误', icon: 'none' });
   } finally {
      isFollowing.value = false;
   }
};

// 点赞/取消点赞
const handleLike = async () => {
   if (isLiking.value) return;

   try {
      isLiking.value = true;
      const isLoved = localDynamic.value.isLove === 1;
      console.log(
         `${isLoved ? '取消点赞' : '点赞'}动态: ${localDynamic.value.id}`
      );

      // 调用对应的API，commentsId传null表示动态点赞
      const result = isLoved
         ? await LoveDel({ commentsId: null, dynamicId: localDynamic.value.id })
         : await LoveAdd({
              commentsId: null,
              dynamicId: localDynamic.value.id
           });

      // 操作成功后先更新本地状态，然后通知父组件
      if (result.code === 0) {
         // 更新本地状态
         localDynamic.value = {
            ...localDynamic.value,
            isLove: isLoved ? 0 : 1,
            love: isLoved
               ? localDynamic.value.love - 1
               : localDynamic.value.love + 1
         };
         // 通知父组件
         emit('update:dynamic', { ...localDynamic.value });
      } else {
         uni.showToast({
            title: result.msg || (isLoved ? '取消点赞失败' : '点赞失败'),
            icon: 'none'
         });
      }
   } catch (error) {
      console.error('点赞/取消点赞失败:', error);
      uni.showToast({ title: '网络错误', icon: 'none' });
   } finally {
      isLiking.value = false;
   }
};

// 评论
const handleComment = () => {
   router.push({
      name: 'datails',
      params: {
         dynamicId: localDynamic.value.id
      }
   });
   // 实际项目中会跳转到评论页面或弹出评论框
};

// 格式化时间
const formattedTime = computed(() => {
   if (!localDynamic.value.createTime) return '';

   // 解析时间字符串为Date对象
   const createTime = new Date(localDynamic.value.createTime);
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
      justify-content: space-between;

      .user-info-row {
         display: flex;
         justify-content: space-between;
         align-items: center;

         min-height: 80rpx;

         .user-info {
            display: flex;
            // flex-wrap: wrap;
            flex-direction: column;
            gap: 8rpx 12rpx;
            align-items: start;

            .username {
               font-size: 28rpx;
               font-weight: 600;
               color: #333;
            }

            .ip-location,
            .location,
            .user-info-item {
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
            .top {
               display: flex;
               justify-content: center;
               align-items: flex-end;
            }
            .time {
               display: flex;
               justify-content: center;
               align-items: start;
               font-size: 20rpx;
               height: 100%;

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
         margin-bottom: 16rpx;

         .image-item {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 4rpx;
            height: 150rpx;

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

         margin-top: 8rpx;

         .action-item {
            display: flex;
            align-items: center;
            margin-right: 32rpx;
            font-size: 28rpx;
            cursor: pointer;
            padding: 4rpx 0;

            :deep(.wd-icon) {
               margin-right: 6rpx;
               font-size: 26rpx;
            }

            &:active {
               color: #007aff;
            }

            &.liked {
               color: #ff4757;

               :deep(.wd-icon) {
                  color: #ff4757;
               }
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

.action-text {
   margin-left: 10rpx;
}

.disabled {
   background: green !important;
   color: #fff !important;
   border: none !important;
}
</style>
