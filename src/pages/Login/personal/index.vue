<template>
   <view
      class="personal-info-container"
      :style="{ backgroundColor: '#f5f5f5' }">
      <!-- 步骤指示器 -->
      <view class="step-indicator">
         <view :class="['step-dot', step >= 1 ? 'active' : '']"></view>
         <view :class="['step-line', step >= 2 ? 'active' : '']"></view>
         <view :class="['step-dot', step >= 2 ? 'active' : '']"></view>
         <view :class="['step-line', step >= 3 ? 'active' : '']"></view>
         <view :class="['step-dot', step >= 3 ? 'active' : '']"></view>
      </view>

      <!-- 步骤内容区域 -->
      <view class="content-area">
         <!-- 第一步：基本信息 -->
         <transition name="slide">
            <view v-if="step === 1" class="step-content">
               <view class="step-title">完善基本信息</view>

               <!-- 头像上传 -->
               <view class="avatar-upload spaced">
                  <wd-upload
                     :value="userInfo.avatarUrl ? [userInfo.avatarUrl] : []"
                     :max-count="1"
                     :show-upload-list="false"
                     :before-upload="handleAvatarUpload"
                     @success="onAvatarUploadSuccess">
                     <view class="avatar-preview">
                        <image
                           :src="userInfo.avatarUrl || defaultAvatar"
                           mode="aspectFill"></image>
                     </view>
                  </wd-upload>
               </view>

               <!-- 名称输入 -->
               <view class="form-item spaced">
                  <input
                     v-model="userInfo.name"
                     type="text"
                     placeholder="请输入您的名称"
                     placeholder-class="placeholder"
                     class="input-field" />
               </view>

               <!-- 年龄选择 -->
               <view class="form-item spaced">
                  <input
                     v-model.number="userInfo.age"
                     type="number"
                     placeholder="请输入您的年龄"
                     placeholder-class="placeholder"
                     class="input-field" />
               </view>

               <!-- 性别选择 -->
               <view class="form-item spaced">
                  <view class="gender-selector">
                     <view
                        :class="[
                           'gender-option',
                           userInfo.gender === 0 ? 'selected' : ''
                        ]"
                        @click="userInfo.gender = 0">
                        <text>女</text>
                     </view>
                     <view
                        :class="[
                           'gender-option',
                           userInfo.gender === 1 ? 'selected' : ''
                        ]"
                        @click="userInfo.gender = 1">
                        <text>男</text>
                     </view>
                  </view>
               </view>
            </view>
         </transition>

         <!-- 第二步：选择标签 -->
         <transition name="slide">
            <view v-if="step === 2" class="step-content">
               <view class="step-title">选择您的兴趣标签</view>
               <view class="tags-container spaced">
                  <view
                     v-for="tag in availableTags"
                     :key="tag"
                     :class="[
                        'tag-item',
                        selectedTags.includes(tag) ? 'selected' : ''
                     ]"
                     @click="toggleTag(tag)"
                     :style="getTagStyle(tag)">
                     <text>{{ tag }}</text>
                  </view>
               </view>
            </view>
         </transition>

         <!-- 第三步：上传相册和简介 -->
         <transition name="slide">
            <view v-if="step === 3" class="step-content">
               <view class="step-title">完善个人展示</view>

               <!-- 相册上传 -->
               <view class="album-upload spaced">
                  <wd-upload
                     v-model="userData.imagsarr"
                     :max-count="9"
                     multiple
                     :before-upload="handleAlbumUpload"
                     @success="onAlbumUploadSuccess"
                     @remove="onAlbumRemove"></wd-upload>
               </view>

               <!-- 个人简介 -->
               <view class="form-item spaced">
                  <textarea
                     v-model="userData.introductory"
                     placeholder="请输入个人简介"
                     placeholder-class="placeholder"
                     class="textarea-field"
                     rows="4"></textarea>
               </view>
            </view>
         </transition>
      </view>

      <!-- 底部按钮区域 -->
      <view class="bottom-area">
         <wd-button
            v-if="step < 3"
            @click="nextStep"
            class="next-btn"
            type="default"
            :style="{ backgroundColor: '#0BDAEE', color: '#fff' }">
            下一步
         </wd-button>
         <wd-button
            v-else
            @click="complete"
            class="next-btn"
            type="default"
            :style="{ backgroundColor: '#0BDAEE', color: '#fff' }">
            开始趣友
         </wd-button>
      </view>

      <!-- 右上角跳过按钮 -->
      <view v-if="step < 3" class="skip-btn" @click="skipStep">跳过</view>
      <!-- 返回按钮 (从第二步开始显示) -->
      <view v-if="step > 1" class="back-button-container" @click="goBack">
         上一步
      </view>
   </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'uni-mini-router';
import defaultAvatar from '@/static/imgs/bg.png';
const router = useRouter();

// 当前步骤
const step = ref(1);

// 基本信息
const userInfo = reactive({
   name: '很帅的人',
   avatarUrl: '',
   age: 18,
   gender: 1
});

// 选择的标签
const selectedTags = ref<string[]>([]);

// 可用标签列表
const availableTags = [
   'java',
   'python',
   '前端',
   '后端',
   '人工智能',
   '摄影',
   '音乐',
   '旅行',
   '美食',
   '运动',
   '电影',
   '读书',
   '游戏',
   '健身',
   '宠物',
   '舞蹈',
   '绘画',
   '编程'
];

// 个人数据
const userData = reactive({
   tag: [] as string[],
   imagsarr: [] as string[],
   introductory: ''
});

// 处理头像上传
function handleAvatarUpload(e: any) {
   // 返回true以允许上传
   return true;
}

// 头像上传成功回调
function onAvatarUploadSuccess(res: any) {
   userInfo.avatarUrl = res.data.url;
}

// 切换标签选择
function toggleTag(tag: string) {
   const index = selectedTags.value.indexOf(tag);
   if (index > -1) {
      selectedTags.value.splice(index, 1);
   } else {
      selectedTags.value.push(tag);
   }
}

// 获取标签样式（实现飘动效果）
function getTagStyle(tag: string) {
   const index = availableTags.indexOf(tag);
   const randomTop = Math.sin(index) * 10;
   const animationDelay = index * 0.1;

   return {
      transform: `translateY(${randomTop}px)`,
      animationDelay: `${animationDelay}s`
   };
}

// 处理相册上传
function handleAlbumUpload(e: any) {
   // 返回true以允许上传
   return true;
}

// 相册上传成功回调
function onAlbumUploadSuccess(res: any) {
   // 假设res.data包含上传后的图片列表
   if (Array.isArray(res.data)) {
      userData.imagsarr = [...userData.imagsarr, ...res.data];
   }
}

// 相册移除回调
function onAlbumRemove(e: any) {
   // 已经由组件内部处理，这里可以添加额外的逻辑
}

// 移除图片
function removeImage(index: number) {
   userData.imagsarr.splice(index, 1);
}

// 返回上一步
function goBack() {
   if (step.value > 1) {
      step.value--;
   }
}

// 下一步
function nextStep() {
   if (step.value === 1) {
      // 保存基本信息
   } else if (step.value === 2) {
      // 保存选择的标签
      userData.tag = [...selectedTags.value];
   }

   step.value++;
}

// 跳过步骤
function skipStep() {
   step.value++;
}

// 完成所有步骤
function complete() {
   // 这里可以发送完整的用户信息到后端
   console.log('完整用户信息:', { ...userInfo, ...userData });

   // 跳转到首页或其他页面
   router.push('/pages/tabar/index');
}
</script>

<style lang="scss" scoped>
.personal-info-container {
   width: 100vw;
   height: 100vh;
   display: flex;
   flex-direction: column;
   padding: 30rpx;
   box-sizing: border-box;
}

.step-indicator {
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 30rpx 0;
   gap: 30rpx;
}

.step-dot {
   width: 20rpx;
   height: 20rpx;
   border-radius: 50%;
   background-color: #ddd;
   transition: all 0.3s;
}

.step-dot.active {
   background-color: #0bdaee;
   transform: scale(1.2);
}

.step-line {
   width: 100rpx;
   height: 4rpx;
   background-color: #ddd;
   transition: all 0.3s;
}

.step-line.active {
   background-color: #0bdaee;
}

.content-area {
   flex: 1;
   overflow-y: auto;
}

.step-content {
   width: 100%;
   height: 100%;
}

.step-title {
   font-size: 40rpx;
   font-weight: bold;
   text-align: center;
   margin-bottom: 60rpx;
   color: #333;
}

/* 分散布局样式 */
.spaced {
   margin-bottom: 60rpx;
}

/* 返回按钮容器样式 */
.back-button-container {
   position: absolute;
   top: 45rpx;
   left: 30rpx;
   font-size: 28rpx;
   color: #999;
}

/* 第一步样式 */
.avatar-upload {
   display: flex;
   justify-content: center;
   margin-bottom: 60rpx;
}

.avatar-preview,
.avatar-placeholder {
   width: 150rpx;
   height: 150rpx;
   border-radius: 50%;
   overflow: hidden;
   border: 2rpx solid #eee;
   display: flex;
   align-items: center;
   justify-content: center;
}

.avatar-preview image {
   width: 100%;
   height: 100%;
}

.avatar-placeholder {
   background-color: #f8f8f8;
}

.avatar-placeholder text {
   font-size: 24rpx;
   color: #999;
}

.avatar-input {
   display: none;
}

.form-item {
   margin-bottom: 40rpx;
}

.input-field {
   width: 100%;
   height: 88rpx;
   border: 2rpx solid #eee;
   border-radius: 10rpx;
   padding: 0 20rpx;
   box-sizing: border-box;
   font-size: 30rpx;
}

.gender-selector {
   display: flex;
   gap: 30rpx;
}

.gender-option {
   flex: 1;
   height: 88rpx;
   border: 2rpx solid #eee;
   border-radius: 10rpx;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 30rpx;
   color: #333;
   transition: all 0.3s;
}

.gender-option.selected {
   border-color: #0bdaee;
   color: #0bdaee;
   background-color: rgba(11, 218, 238, 0.1);
}

/* 第二步样式 */
.tags-container {
   display: flex;
   flex-wrap: wrap;
   gap: 20rpx;
   padding: 20rpx;
}

.tag-item {
   padding: 20rpx 36rpx;
   border-radius: 40rpx;
   background-color: #fff;
   border: 2rpx solid #eee;
   font-size: 28rpx;
   color: #333;
   transition: all 0.3s;
   animation: float 3s ease-in-out infinite;
}

@keyframes float {
   0%,
   100% {
      transform: translateY(0);
   }
   50% {
      transform: translateY(-10px);
   }
}

.tag-item.selected {
   background-color: #0bdaee;
   color: #fff;
   border-color: #0bdaee;
}

/* 第三步样式 */
.album-upload {
   display: flex;
   flex-wrap: wrap;
   gap: 20rpx;
   margin-bottom: 40rpx;
}

.album-item {
   width: 180rpx;
   height: 180rpx;
   position: relative;
   border-radius: 10rpx;
   overflow: hidden;
   border: 2rpx solid #eee;
}

.album-item image {
   width: 100%;
   height: 100%;
}

.remove-btn {
   position: absolute;
   top: 10rpx;
   right: 10rpx;
   width: 40rpx;
   height: 40rpx;
   background-color: rgba(0, 0, 0, 0.5);
   border-radius: 50%;
   color: #fff;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 36rpx;
   line-height: 1;
}

.add-album-btn {
   width: 180rpx;
   height: 180rpx;
   border: 2rpx dashed #ddd;
   border-radius: 10rpx;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 60rpx;
   color: #999;
}

.album-input {
   display: none;
}

.textarea-field {
   width: 100%;
   border: 2rpx solid #eee;
   border-radius: 10rpx;
   padding: 20rpx;
   box-sizing: border-box;
   font-size: 30rpx;
   line-height: 1.5;
   resize: none;
}

/* 底部按钮区域 */
.bottom-area {
   padding: 30rpx 0;
}

.next-btn {
   width: 100%;
   height: 96rpx;
   font-size: 32rpx;
   border-radius: 48rpx;
}

/* 跳过按钮 */
.skip-btn {
   position: absolute;
   top: 45rpx;
   right: 30rpx;
   font-size: 28rpx;
   color: #999;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
   transition: transform 0.3s;
}

.slide-enter-from {
   transform: translateX(100%);
}

.slide-leave-to {
   transform: translateX(-100%);
}

.placeholder {
   color: #999;
}
</style>
