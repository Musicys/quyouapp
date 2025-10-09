<template>
   <view class="page">
      <!-- 顶部用户信息卡片 -->
      <view
         class="bg-gradient-to-r from-pink-500 to-purple-500 p-6 relative overflow-hidden">
         <!-- 装饰性圆点 -->
         <view
            class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></view>
         <view
            class="absolute bottom-5 left-10 w-12 h-12 bg-white/10 rounded-full"></view>

         <view class="!flex items-center justify-between relative z-10">
            <!-- 左侧头像和用户信息 -->
            <view class="!flex items-center">
               <image
                  :src="
                     userStore.userInfo?.avatarUrl ||
                     'https://ts1.tc.mm.bing.net/th/id/OIP-C.-r8TdWtF72EheUNjt_uKvwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3'
                  "
                  class="!w-20 !h-20 rounded-full border-4 border-white/30 object-cover"
                  mode="aspectFill" />
               <view class="mr-4 text-white h-full">
                  <view class="text-xl font-bold mb-0.5">{{
                     userStore.userInfo?.username || '用户名称'
                  }}</view>
                  <view class="text-white/80 text-sm mt-1">{{
                     userStore.userInfo?.email || 'user@example.com'
                  }}</view>
               </view>
            </view>

            <!-- 右侧查看按钮 -->
            <view class="!flex items-center text-white/90">
               <text>查看</text>
               <wd-icon name="arrow-right" size="14" class="ml-1" />
            </view>
         </view>

         <!-- 用户数据统计 -->
         <view class="!flex justify-around mt-8 cart">
            <view class="text-center">
               <view class="text-2xl font-bold">24</view>
               <view class="text-xs mt-1">匹配成功</view>
            </view>
            <view class="text-center">
               <view class="text-2xl font-bold">128</view>
               <view class="text-xs mt-1">收到消息</view>
            </view>
            <view class="text-center">
               <view class="text-2xl font-bold">56</view>
               <view class="text-xs mt-1">活动参与</view>
            </view>
         </view>
      </view>

      <!-- 选项卡列表 -->
      <view class="!mt-4 px-4">
         <view class="bg-white rounded-xl mt-2 overflow-hidden shadow-sm">
            <view class="border-b border-gray-100">
               <wd-cell
                  title="我的匹配"
                  icon="heart"
                  :show-arrow="true"
                  class="cell-item"
                  @click="handleMatchClick">
                  <template #right-icon>
                     <view
                        class="text-xs bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">
                        12
                     </view>
                  </template>
               </wd-cell>
            </view>

            <view class="border-b border-gray-100">
               <wd-cell
                  title="我的活动"
                  icon="calendar"
                  :show-arrow="true"
                  class="cell-item"
                  @click="handleActivityClick">
                  <template #right-icon>
                     <view class="text-xs !flex items-center">
                        <text class="text-red-500">*</text>
                        <wd-icon name="arrow-right" size="12" class="ml-2" />
                     </view>
                  </template>
               </wd-cell>
            </view>

            <wd-cell
               title="我的收藏"
               icon="star"
               :show-arrow="true"
               class="cell-item"
               @click="handleCollectionClick" />
         </view>
      </view>

      <!-- 系统设置和客服帮助 -->
      <view class="!mt-4 px-4">
         <view class="bg-white rounded-xl mt-2 overflow-hidden shadow-sm">
            <view class="border-b border-gray-100">
               <wd-cell
                  title="系统设置"
                  icon="setting"
                  :show-arrow="true"
                  class="cell-item"
                  @click="handleSettingClick" />
            </view>

            <view class="border-b border-gray-100">
               <wd-cell
                  title="客服帮助"
                  icon="help-circle"
                  :show-arrow="true"
                  class="cell-item"
                  @click="handleHelpClick" />
            </view>

            <view class="border-b border-gray-100">
               <wd-cell
                  title="关于我们"
                  icon="info-circle"
                  :show-arrow="true"
                  class="cell-item"
                  @click="handleAboutClick" />
            </view>
            <view class="border-b border-gray-100" @click="handleLogout">
               <wd-cell
                  title="退出登录"
                  icon="logout"
                  :show-arrow="true"
                  class="cell-item" />
            </view>

            <wd-cell
               title="隐私政策"
               icon="shield"
               :show-arrow="true"
               class="cell-item"
               @click="handlePrivacyClick" />
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { useRouter } from 'uni-mini-router';
import { useStore } from '@/store/user';
import { sockeStore } from '@/store/socke';
const router = useRouter();
const userStore = useStore();
const { SocketTask } = sockeStore();

const goBack = e => {
   router.push({
      name: e
   });
};

// 退出登录处理
const handleLogout = () => {
   // 显示确认弹窗
   uni.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: res => {
         if (res.confirm) {
            SocketTask.close();
            //端口 websoke
            router.push({
               path: '/pages/login/index'
            });

            return;
         }
      }
   });
};
</script>

<style lang="scss" scoped>
.page {
   overflow: hidden;
   padding-top: var(--status-bar-height); // 状态栏
   padding-bottom: env(safe-area-inset-bottom); // 底部安全区
}
.cart {
   background: #fff;
   color: black;
   margin-top: 1em;
   padding: 10rpx 20rpx;
   border-radius: 15rpx;
}

.cell-item {
   &::after {
      border: none !important;
   }

   .wd-cell__title {
      font-size: 15px;
   }

   .wd-cell__icon {
      color: #666;
   }
}

// 添加卡片动画效果
.card-hover {
   transition: all 0.3s ease;

   &:active {
      transform: scale(0.98);
   }
}
</style>
