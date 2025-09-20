<template>
   <view class="page">
      <!-- 顶部用户信息卡片 -->
      <view
         class="bg-gradient-to-r from-pink-500 to-purple-500 rounded-b-3xl p-6 relative overflow-hidden">
         <!-- 装饰性圆点 -->
         <view
            class="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></view>
         <view
            class="absolute bottom-5 left-10 w-12 h-12 bg-white/10 rounded-full"></view>

         <view class="!flex items-center justify-between relative z-10">
            <!-- 左侧头像和用户信息 -->
            <view class="!flex items-center">
               <image
                  src="https://ts1.tc.mm.bing.net/th/id/OIP-C.-r8TdWtF72EheUNjt_uKvwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
                  class="!w-20 !h-20 rounded-full border-4 border-white/30 object-cover"
                  mode="aspectFill" />
               <view class="ml-4 text-white">
                  <view class="text-xl font-bold">用户名称</view>
                  <view class="text-white/80 text-sm mt-1"
                     >user@example.com</view
                  >
               </view>
            </view>

            <!-- 右侧查看按钮 -->
            <view class="!flex items-center text-white/90">
               <text>查看</text>
               <wd-icon name="arrow-right" size="14" class="ml-1" />
            </view>
         </view>

         <!-- 用户数据统计 -->
         <view class="!flex justify-around mt-8">
            <view class="text-center text-white">
               <view class="text-2xl font-bold">24</view>
               <view class="text-xs mt-1 text-white/80">匹配成功</view>
            </view>
            <view class="text-center text-white">
               <view class="text-2xl font-bold">128</view>
               <view class="text-xs mt-1 text-white/80">收到消息</view>
            </view>
            <view class="text-center text-white">
               <view class="text-2xl font-bold">56</view>
               <view class="text-xs mt-1 text-white/80">活动参与</view>
            </view>
         </view>
      </view>

      <!-- 选项卡列表 -->
      <view class="mt-4 px-4">
         <text class="text-gray-600 text-sm font-medium">我的服务</text>

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
      <view class="mt-4 px-4">
         <text class="text-gray-600 text-sm font-medium">系统服务</text>

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
import { useRouter } from 'vue-router';
import { useStore } from '@/store/user';

const router = useRouter();
const userStore = useStore();

// 处理各项点击事件
const handleMatchClick = () => {
   // 跳转到匹配页面
   router.push('/pages/match/index');
};

const handleActivityClick = () => {
   // 跳转到活动页面
   router.push('/pages/activity/index');
};

const handleCollectionClick = () => {
   // 跳转到收藏页面
   router.push('/pages/collection/index');
};

const handleSettingClick = () => {
   // 跳转到设置页面
   router.push('/pages/setting/index');
};

const handleHelpClick = () => {
   // 跳转到客服页面
   router.push('/pages/help/index');
};

const handleAboutClick = () => {
   // 跳转到关于我们页面
   router.push('/pages/about/index');
};

const handlePrivacyClick = () => {
   // 跳转到隐私政策页面
   router.push('/pages/privacy/index');
};

// 退出登录处理
const handleLogout = () => {
   // 显示确认弹窗
   uni.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: res => {
         if (res.confirm) {
            // 调用退出登录接口
            userStore.setUserInfo(null);
            uni.showToast({
               title: '退出成功',
               icon: 'success'
            });
            // 跳转到登录页面
            router.replace('/pages/Login/index');
         }
      }
   });
};
</script>

<style lang="scss" scoped>
.page {
   overflow: hidden;
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
