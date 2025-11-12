<template>
   <view class="user-card">
      <!-- 左侧头像区域 -->
      <view
         class="avatar-container"
         @tap="router.push({ name: 'preinfo', params: { userId: data.id } })">
         <image
            :src="data.avatarUrl"
            mode="aspectFill"
            class="avatar"
            :alt="data.username" />
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
                  <tn-icon
                     :name="data.gender === 1 ? 'sex-male' : 'sex-female'"
                     size="36"
                     :color="data.gender === 1 ? '#4caf50' : '#f44336'"
                     bold />
                  <text class="username">{{ data.username }}</text>
                  <text class="online-status" v-if="data.login === 1">
                     {{ data.login === 1 ? '在线' : '昨天在线' }}
                  </text>
               </view>
               <!-- 右侧操作按钮 -->
               <wd-button plain size="small" @click="gosend" class="btn-text">{{
                  IsAdd ? '发送消息' : '添加好友'
               }}</wd-button>
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
               <text class="intro">{{
                  data.introductory || '用户很懒，什么都没写...'
               }}</text>
            </view>
         </vue>
         <!-- 图片展示区 -->
         <view v-if="imageList.length" class="images-container">
            <tn-photo-album :data="imageList" :column="3" max="3" />
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { User } from '@/api/user/model/type';
import { useRouter } from 'uni-mini-router';
import { sockeStore } from '@/store/socke';
import { useStore } from '@/store/user';
const store = useStore();
const { IsFriend, send } = sockeStore();
const router = useRouter();
// 接收父组件传递的用户数据
const props = defineProps<{
   data: User;
}>();
const IsAdd = ref(false);

// 解析图片数组
const imageList = computed(() => {
   try {
      return JSON.parse(props.data.imagsarr) as string[];
   } catch (e) {
      return [];
   }
});

const gosend = () => {
   if (IsAdd.value) {
      router.push({ name: 'chat', params: { sendid: props.data.id } });
   } else {
      send(
         JSON.stringify({
            id: store.userInfo.id,
            type: 4,
            sendid: props.data.id,
            sendteam: null,
            context: '你好啊，我们开始聊天把-.-',
            sendTime: new Date()
         })
      );
      IsAdd.value = true;
      setTimeout(() => {
         router.push({ name: 'chat', params: { sendid: props.data.id } });
      }, 500);
   }
};
onMounted(() => {
   IsAdd.value = IsFriend(props.data.id);
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
            aspect-ratio: 1 / 1;
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
