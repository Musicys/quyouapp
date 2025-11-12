<template>
   <view class="submit-dynamic-page">
      <!-- 自定义导航栏 -->
      <view class="nav-bar">
         <view class="nav-left" @click="handleBack">
            <wd-icon name="arrow-left" size="36rpx" color="#333"></wd-icon>
         </view>
         <view class="nav-center"> </view>
         <view class="nav-right">
            <button
               :class="[
                  'publish-btn',
                  from.context.trim()
                     ? 'publish-btn-active'
                     : 'publish-btn-disabled'
               ]"
               @click="handlePublish">
               发布
            </button>
         </view>
      </view>

      <!-- 输入区域 -->
      <view class="input-area">
         <textarea
            v-model="from.context"
            placeholder="分享你的日常，让缘分来得更快点~"
            placeholder-class="placeholder"
            class="content-textarea"
            :auto-height="true"
            :show-confirm-bar="false"></textarea>
      </view>
      <!-- 已选图片展示 -->
      <view v-if="imagsarr.length > 0" class="selected-images">
         <view class="image-item" v-for="(img, index) in imagsarr" :key="index">
            <image :src="img" mode="aspectFill" class="selected-image"></image>
            <view class="remove-btn" @click.stop="removeImage(index)">
               <wd-icon name="close" color="#fff"></wd-icon>
            </view>
         </view>
      </view>
      <!-- 固定在顶部的布局 -->
      <view class="fixed-top-layout">
         <!-- 第一行：定制，添加话题 -->
         <view class="topic-line">
            <view class="location-info">
               <wd-icon name="location" color="#999"></wd-icon>
               <text class="location-text">{{ locationText }}</text>
            </view>
            <view class="add-topic" @click="addTopic">
               <wd-icon name="hash" color="#0BDAEE"></wd-icon>
               <text class="topic-text">添加话题</text>
            </view>
         </view>

         <!-- 第二行：标签和相册icon -->
         <view class="function-line">
            <view class="function-item" @click="selectEmoji">
               <tn-icon name="cute" bold />
            </view>
            <view class="function-item" @click="openAlbum">
               <wd-icon name="image" color="#666"></wd-icon>
            </view>
         </view>
      </view>

      <!-- 底部空间，避免内容被遮挡 -->
      <view class="bottom-space"></view>
   </view>
</template>

<script setup lang="ts">
import { addDynamic } from '@/api/dynamic';
import { useStore } from '@/store/user';
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'uni-mini-router';
import { updateOssFile } from '@/api/file';
const router = useRouter();
const store = useStore();
const { userInfo, location } = store;

// 表单数据
const from = reactive({
   context: '',
   imgArr: [],
   lat: location.lat,
   lng: location.lng,
   userId: userInfo.id
});

// 已选图片数组
const imagsarr = ref<string[]>([]);

// 位置信息
const locationText = computed(() => {
   return userInfo?.province || '定位中...';
});

// 返回上一页
const handleBack = () => {
   router.back();
};

// 发布动态
const handlePublish = async () => {
   if (!from.context.trim()) {
      uni.showToast({
         title: '请输入内容',
         icon: 'none'
      });
      return;
   }
   uni.showLoading({
      title: '发布中...'
   });
   if (imagsarr.value.length > 0) {
      const rucest = [];

      for (let file of imagsarr.value) {
         let res = updateOssFile(file);

         rucest.push(res);
      }

      //上传相册
      await Promise.all(rucest).then(res => {
         for (let records of res) {
            let data = JSON.parse(records?.data);
            if (data.code === 0) {
               from.imgArr.push(data.data);
            }
         }
      });
   }

   // 准备图片数据

   let sumbit = {
      context: from.context,
      imgArr: JSON.stringify(from.imgArr),
      lat: from.lat,
      lng: from.lng,
      userId: from.userId
   };

   try {
      const res = await addDynamic(sumbit);
      if (res.code === 0) {
         uni.hideLoading();
         uni.showToast({
            title: '发布成功',
            icon: 'none'
         });
         // 发布成功后返回上一页
         setTimeout(() => {
            router.back();
         }, 1500);
      }
   } catch (error) {
      uni.hideLoading();
      uni.showToast({
         title: '网络异常，请重试',
         icon: 'none'
      });
   }
};

// 打开相册选择图片
const openAlbum = () => {
   // 计算还能选择的图片数量（最多9张）
   const maxCount = 9 - imagsarr.value.length;
   if (maxCount <= 0) {
      uni.showToast({
         title: '最多只能选择9张图片',
         icon: 'none'
      });
      return;
   }

   uni.chooseImage({
      count: maxCount,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: res => {
         // 将新选择的图片添加到数组中
         console.log(res);

         imagsarr.value = [...imagsarr.value, ...res.tempFilePaths];
      },
      fail: err => {
         console.error('打开相册失败:', err);
      }
   });
};

// 移除已选图片
const removeImage = (index: number) => {
   imagsarr.value.splice(index, 1);
};

// 添加话题
const addTopic = () => {
   // 这里可以实现添加话题的逻辑
   // 例如弹出话题选择面板或直接在输入框中插入话题符号
   uni.showToast({
      title: '话题功能待实现',
      icon: 'none'
   });
};

// 选择表情
const selectEmoji = () => {
   // 这里可以实现表情选择的逻辑
   uni.showToast({
      title: '表情功能待实现',
      icon: 'none'
   });
};

// 页面加载时获取位置信息
onMounted(() => {
   if (!location.lat || !location.lng) {
      store.setLocation();
   }
});
</script>

<style lang="scss" scoped>
.submit-dynamic-page {
   padding-top: var(--status-bar-height); /* 状态栏 */
   padding-bottom: env(safe-area-inset-bottom); /* 底部安全区 */
   width: 100%;
   height: 100vh;
   background-color: #fff;
   display: flex;
   flex-direction: column;
}

/* 导航栏样式 */
.nav-bar {
   display: flex;
   align-items: center;
   justify-content: space-between;
   height: var(--quyou-nav-ste-height);
   padding: 0 16rpx;
   font-size: 26rpx;
   background-color: var(--quyou-nav-bg-color);
   border-bottom: 1px solid #f0f0f0;
}

.nav-left,
.nav-right {
   font-size: 26rpx;
   display: flex;
   align-items: center;
   justify-content: center;
}

.nav-center {
   flex: 1;
   text-align: center;
}

.nav-title {
   font-size: 24rpx;
   font-weight: 600;
   color: #333;
}

.publish-btn {
   font-size: 24rpx;
   padding: 0;
   min-width: auto;
   line-height: 36rpx;
   border-radius: 8rpx;
   padding: 5rpx 26rpx;
}

/* 发布按钮禁用状态 */
.publish-btn-disabled {
   background-color: #eeeeee;
   color: #898989;
}

/* 发布按钮激活状态 */
.publish-btn-active {
   background-color: #0bdaee;
   color: #000000;
}

/* 输入区域样式 */
.input-area {
   padding: 16rpx;
   flex: 1;
   background: var(--quyou-bg-centext-color);
}

.content-textarea {
   width: 100%;
   min-height: 120rpx;
   font-size: 28rpx;
   color: #333;

   line-height: 1.5;
   padding: 0;
}

.placeholder {
   color: #999;
}

/* 固定顶部布局 */
.fixed-top-layout {
   position: sticky;
   top: 0;
   z-index: 10;
   background-color: #fff;
   border-top: 1px solid #f0f0f0;
   padding: 12rpx 16rpx;
}

/* 话题行样式 */
.topic-line {
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 12rpx;
   height: 56rpx;
   font-size: 26rpx;
}

.location-info {
   display: flex;
   font-size: 26rpx;
   align-items: center;
}

.location-text {
   color: #999;
   margin-left: 4rpx;
}

.add-topic {
   display: flex;
   align-items: center;
   padding: 6rpx 12rpx;
   background-color: #f5f5f5;
   border-radius: 16rpx;
   font-size: 26rpx;
}

.topic-text {
   font-size: 26rpx;
   color: #0bdaee;
   margin-left: 4rpx;
}

/* 功能行样式 */
.function-line {
   display: flex;
   padding: 8rpx 0;
}

.function-item {
   font-size: 42rpx;
   display: flex;
   margin: 0 12rpx;
   align-items: center;
   justify-content: center;
}

/* 已选图片样式 */
.selected-images {
   display: flex;
   flex-wrap: wrap;
   padding: 0 16rpx 16rpx;
   gap: 8rpx;
}

.image-item {
   width: 120rpx;
   height: 120rpx;
   position: relative;
}

.selected-image {
   width: 100%;
   height: 100%;
   border-radius: 8rpx;
}

.remove-btn {
   position: absolute;
   top: -8rpx;
   right: -8rpx;
   width: 32rpx;
   height: 32rpx;
   background-color: rgba(0, 0, 0, 0.5);
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
}

/* 底部空间 */
.bottom-space {
   height: 20rpx;
}
</style>
