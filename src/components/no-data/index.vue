<template>
   <view class="no-data-container">
      <!-- SVG图标 -->
      <view class="icon-container">
         <svg viewBox="0 0 100 100" class="no-data-icon">
            <!-- 主轮廓 -->
            <circle
               cx="50"
               cy="50"
               r="45"
               fill="#f5f5f5"
               stroke="#e0e0e0"
               stroke-width="2" />
            <!-- 文件轮廓 -->
            <rect
               x="30"
               y="30"
               width="40"
               height="45"
               rx="2"
               ry="2"
               fill="#fff"
               stroke="#e0e0e0"
               stroke-width="2" />
            <!-- 文件顶部 -->
            <polygon points="30,30 50,20 70,30" fill="#e0e0e0" />
            <!-- 波浪线表示空 -->
            <path
               d="M35,50 Q45,42 55,50 Q65,58 75,50"
               fill="none"
               stroke="#bdbdbd"
               stroke-width="1.5" />
         </svg>
      </view>

      <!-- 文本信息 -->
      <view class="text-container">
         <text class="no-data-text">{{ message }}</text>
         <text v-if="subMessage" class="no-data-subtext">{{ subMessage }}</text>
      </view>

      <!-- 可选按钮 -->
      <view v-if="showButton" class="button-container">
         <wd-button size="small" type="primary" @click="handleButtonClick">{{
            buttonText
         }}</wd-button>
      </view>
   </view>
</template>

<script setup lang="ts">
// 定义props
const props = defineProps<{
   message?: string;
   subMessage?: string;
   showButton?: boolean;
   buttonText?: string;
}>();

// 定义默认值
const message = props.message || '暂无数据';
const subMessage = props.subMessage;
const showButton = props.showButton || false;
const buttonText = props.buttonText || '刷新';

// 定义事件
const emit = defineEmits<{
   'button-click': [];
}>();

// 按钮点击处理
const handleButtonClick = () => {
   emit('button-click');
};
</script>

<style lang="scss" scoped>
.no-data-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: 60rpx 20rpx;
   min-height: 300rpx;
   text-align: center;

   .icon-container {
      margin-bottom: 24rpx;
      width: 200rpx;
      height: 200rpx;

      .no-data-icon {
         width: 100%;
         height: 100%;
      }
   }

   .text-container {
      margin-bottom: 32rpx;

      .no-data-text {
         display: block;
         font-size: 28rpx;
         color: #999;
         margin-bottom: 12rpx;
      }

      .no-data-subtext {
         display: block;
         font-size: 24rpx;
         color: #bdbdbd;
         line-height: 1.5;
      }
   }

   .button-container {
      margin-top: 16rpx;
   }
}

// 适配不同尺寸的屏幕
@media (max-width: 375px) {
   .no-data-container {
      padding: 40rpx 20rpx;

      .icon-container {
         width: 160rpx;
         height: 160rpx;
      }
   }
}
</style>
