<template>
   <view class="content">
      <view class="bg-[red]">123</view>
      <wd-button>主要按钮</wd-button>
      <wd-button type="success">成功按钮</wd-button>
      <wd-button type="info">信息按钮</wd-button>
      <wd-button type="warning">警告按钮</wd-button>
      <wd-button type="error">危险按钮</wd-button>
   </view>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.content {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;

   .logo {
      height: 200rpx;
      width: 200rpx;
      margin-top: 200rpx;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 50rpx;
   }
}

.text-area {
   display: flex;
   justify-content: center;
}

.title {
   font-size: 36rpx;
   color: #8f8f94;
}
</style>
