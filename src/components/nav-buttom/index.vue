<template>
   <!-- #ifdef MP-WEIXIN -->
   <view class="nav-placeholder" :style="{ height: 140 + 'rpx' }"></view>
   <!-- #endif -->

   <!-- #ifdef H5 -->
   <view class="nav-placeholder" :style="{ height: 140 + 'rpx' }"></view>
   <!-- #endif -->

   <!-- #ifdef APP-PLUS -->
   <view class="nav-placeholder" :style="{ height: 140 + 'rpx' }"></view>
   <!-- #endif -->
</template>
