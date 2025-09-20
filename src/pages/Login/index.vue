<template>
   <view
      class="w-full !flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 h-[100vh] to-purple-50">
      <!-- 登录/注册表单卡片 -->
      <view class="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8">
         <!-- 标题 -->
         <view class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-1">欢迎回来</h1>
            <p class="text-gray-500 text-sm">登录您的账号继续使用</p>
         </view>

         <!-- 模式切换标签 -->
         <view class="!flex border-b border-gray-200 mb-6">
            <view
               class="!flex-1 py-3 text-center cursor-pointer transition-all duration-300"
               :class="{
                  'text-blue-500 border-b-2 border-blue-500 font-medium':
                     isLoginMode,
                  'text-gray-500': !isLoginMode
               }"
               @click="toggleMode(true)">
               登录
            </view>
            <view
               class="!flex-1 py-3 text-center cursor-pointer transition-all duration-300"
               :class="{
                  'text-blue-500 border-b-2 border-blue-500 font-medium':
                     !isLoginMode,
                  'text-gray-500': isLoginMode
               }"
               @click="toggleMode(false)">
               注册
            </view>
         </view>

         <!-- 登录表单 -->
         <view v-if="isLoginMode" class="space-y-4 animate-fadeIn">
            <wd-input
               v-model="loginForm.userAccount"
               placeholder="请输入账号"
               clearable
               class="w-full"
               shape="rounded"
               :border="true"
               custom-class="mt-1" />

            <wd-input
               v-model="loginForm.userPassword"
               type="password"
               placeholder="请输入密码"
               clearable
               class="w-full"
               shape="rounded"
               :border="true" />

            <wd-button
               type="primary"
               block
               style="margin-top: 1em"
               shape="rounded"
               @click="handleLogin">
               登录
            </wd-button>
         </view>

         <!-- 注册表单 -->
         <view v-else class="space-y-4 animate-fadeIn">
            <wd-input
               v-model="registerForm.userAccount"
               placeholder="请设置账号"
               clearable
               class="w-full"
               shape="rounded"
               :border="true" />

            <wd-input
               v-model="registerForm.userPassword"
               type="password"
               placeholder="请设置密码"
               clearable
               class="w-full"
               shape="rounded"
               :border="true" />

            <wd-input
               v-model="registerForm.confirmuserPassword"
               type="password"
               placeholder="请确认密码"
               clearable
               class="w-full"
               shape="rounded"
               :border="true" />

            <view class="!flex gap-3">
               <wd-input
                  v-model="registerForm.verificationCode"
                  placeholder="请输入验证码"
                  clearable
                  class="!flex-1"
                  shape="rounded"
                  :border="true" />
               <wd-button
                  type="success"
                  :block="true"
                  size="small"
                  :disabled="countdown > 0"
                  @click="sendVerificationCode">
                  {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
               </wd-button>
            </view>

            <wd-button
               type="primary"
               block
               class="!mt-6"
               shape="rounded"
               @click="handleRegister">
               注册
            </wd-button>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'uni-mini-router';
import { useStore } from '@/store/user';
import { UserLogin } from '@/api/user';
const router = useRouter();
const store = useStore();

// 登录模式切换
const isLoginMode = ref(true);
const toggleMode = (mode: boolean) => {
   isLoginMode.value = mode;
};

// 登录表单数据
const loginForm = reactive({
   userAccount: 'music123',
   userPassword: '12345678'
});

// 注册表单数据
const registerForm = reactive({
   userAccount: 'music123',
   userPassword: '12345678',
   confirmuserPassword: '',
   verificationCode: ''
});

// 验证码倒计时
const countdown = ref(0);
let countdownTimer: number | null = null;

// 发送验证码
const sendVerificationCode = () => {
   if (!registerForm.userAccount) {
      uni.showToast({
         title: '请先输入账号',
         icon: 'none'
      });
      return;
   }

   startCountdown();
   uni.showToast({
      title: '验证码已发送',
      icon: 'none'
   });
};

// 开始倒计时
const startCountdown = () => {
   countdown.value = 60;
   if (countdownTimer) clearInterval(countdownTimer);
   countdownTimer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
         if (countdownTimer) clearInterval(countdownTimer);
         countdownTimer = null;
      }
   }, 1000) as unknown as number;
};

// 表单验证
const validateForm = (type: 'login' | 'register'): boolean => {
   if (type === 'login') {
      if (!loginForm.userAccount) {
         uni.showToast({
            title: '请输入账号',
            icon: 'none'
         });
         return false;
      }
      if (!loginForm.userPassword) {
         uni.showToast({
            title: '请输入密码',
            icon: 'none'
         });
         return false;
      }
   } else {
      if (!registerForm.userAccount) {
         uni.showToast({
            title: '请设置账号',
            icon: 'none'
         });
         return false;
      }
      if (!registerForm.userPassword) {
         uni.showToast({
            title: '请设置密码',
            icon: 'none'
         });
         return false;
      }
      if (registerForm.userPassword !== registerForm.confirmuserPassword) {
         uni.showToast({
            title: '两次密码输入不一致',
            icon: 'none'
         });
         return false;
      }
      if (!registerForm.verificationCode) {
         uni.showToast({
            title: '请输入验证码',
            icon: 'none'
         });
         return false;
      }
   }
   return true;
};

// 处理登录
const handleLogin = () => {
   //
   // return;
   if (!validateForm('login')) return;

   // 模拟登录成功

   UserLogin(loginForm).then(res => {
      if (res.code == 0) {
         store.setUserInfo(res.data);
         store.setTokens({ ...res.data, tokens: loginForm, is_default: 1 });
         uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500,
            success: () => {
               // 延迟跳转防止提示被覆盖
               setTimeout(() => {
                  router.pushTab('/pages/tabar/Home/index');
               }, 1500);
            }
         });
      }
   });

   return;

   // // 显示登录成功提示
   // uni.showToast({
   //    title: '登录成功',
   //    icon: 'success',
   //    duration: 1500,
   //    success: () => {
   //       // 延迟跳转防止提示被覆盖
   //       setTimeout(() => {
   //          router.push({
   //             path: '/pages/tabar/home/index'
   //          });
   //       }, 1500);
   //    }
   // });
};

// 处理注册
const handleRegister = () => {
   if (!validateForm('register')) return;

   // 模拟注册成功
   console.log('注册:', registerForm);
   store.setUserInfo(registerForm.userAccount);

   // 显示注册成功提示
   uni.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 1500,
      success: () => {
         // 延迟跳转防止提示被覆盖
         setTimeout(() => {
            router.push({
               path: '/pages/tabar/home/index'
            });
         }, 1500);
      }
   });
};
</script>

<style lang="scss" scoped>
/* 自定义动画 */
@keyframes fadeIn {
   from {
      opacity: 0;
      transform: translateY(10px);
   }
   to {
      opacity: 1;
      transform: translateY(0);
   }
}
:deep() {
   .wd-input__inner {
      margin-bottom: 1em;
   }
}
.animate-fadeIn {
   animation: fadeIn 0.3s ease-out;
}
</style>
