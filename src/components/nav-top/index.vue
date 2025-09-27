<template>
   <!-- #ifdef MP-WEIXIN -->
   <view
      class="nav-placeholder"
      :style="{ height: `calc(var(--status-bar-height) + 44px)` }"></view>
   <!-- #endif -->

   <!-- #ifdef H5 -->
   <view style="margin-top: var(--quyou-nav-height)"> </view>
   <!-- #endif -->

   <!-- #ifdef APP-PLUS -->
   <view class="nav-placeholder" style="height: 155rpx"></view>
   <!-- #endif -->
</template>
