<template>
   <view class="wrapper" :style="colorStyle">
      <!-- #ifdef MP -->
      <view class="title-bar" style="height: 43px">
         <view class="icon" @click="back" v-if="!isHome">
            <image src="../static/left.png"></image>
         </view>
         <view class="icon" @click="home" v-else>
            <image src="../static/home.png"></image>
         </view>
         {{ pageTitle }}
      </view>
      <!-- #endif -->
      <view class="page-msg">
         <view class="title">
            {{ current ? '快速登录' : '账号登录' }}
         </view>
         <view class="tip"> 首次登录会自动注册 </view>
      </view>
      <view class="page-form">
         <view class="animate-fadeIn">
            <!-- 登录方式切换 -->
            <view class="login-method-switch">
               <view
                  :class="[
                     'method-tab',
                     loginMethod === 'password' ? 'active' : ''
                  ]"
                  @click="toggleLoginMethod('password')">
                  密码登录
               </view>
               <view
                  :class="[
                     'method-tab',
                     loginMethod === 'verification' ? 'active' : ''
                  ]"
                  @click="toggleLoginMethod('verification')">
                  验证码注册
               </view>
            </view>

            <view class="temp" v-if="loginMethod === 'password'">
               <!-- 登录表单 -->
               <view class="item">
                  <input
                     type="text"
                     placeholder="请输入账号或邮箱"
                     placeholder-class="placeholder"
                     v-model="loginForm.userAccount"
                     :adjust-position="false" />
               </view>
               <view class="item">
                  <input
                     type="password"
                     placeholder="请输入密码"
                     placeholder-class="placeholder"
                     v-model="loginForm.userPassword"
                     :adjust-position="false" />
               </view>
            </view>

            <!-- 验证码输入区域 -->
            <view class="temp" v-else>
               <view class="item">
                  <input
                     type="text"
                     placeholder="请输入邮箱"
                     placeholder-class="placeholder"
                     v-model="registerForm.userAccount"
                     :adjust-position="false" />
               </view>
               <!-- 密码输入区域 -->
               <view class="item">
                  <input
                     type="password"
                     placeholder="请登录密码"
                     placeholder-class="placeholder"
                     v-model="registerForm.userPassword"
                     :adjust-position="false" />
               </view>
               <view class="item">
                  <input
                     type="password"
                     placeholder="请确认密码"
                     placeholder-class="placeholder"
                     v-model="registerForm.checkPassword"
                     :adjust-position="false" />
               </view>
               <view class="item acea-row row-between-wrapper">
                  <input
                     type="number"
                     placeholder="请输入验证码"
                     placeholder-class="placeholder"
                     :maxlength="6"
                     class="codeInput"
                     v-model="registerForm.planetCode"
                     :adjust-position="false" />
                  <view class="line"></view>
                  <button
                     class="code !text-[0.8em]"
                     :class="countdown > 0 ? 'on' : ''"
                     :disabled="countdown > 0"
                     @click="sendVerificationCode()">
                     {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
                  </button>
               </view>
            </view>

            <!-- <view class="btn" @click="handleLogin"> 登录 </view> -->
            <wd-button
               v-if="loginMethod === 'password'"
               @click="handleLogin"
               class="w-full"
               type="success">
               登录
            </wd-button>
            <wd-button
               v-else
               @click="handleRegister"
               class="w-full"
               type="success">
               注册
            </wd-button>
         </view>
      </view>
   </view>
</template>

<script setup lang="ts">
import bg from '@/static/imgs/bg.png';
import { useRouter } from 'uni-mini-router';
import { useStore } from '@/store/user';
import { UserLogin, UserGetVerifyCode, UserRegister } from '@/api/user';
import { sockeStore } from '@/store/socke';

const webstore = sockeStore();
const router = useRouter();
const store = useStore();

// 登录方式切换
const loginMethod = ref<'password' | 'verification'>('password'); // password: 密码登录, verification: 验证码注册

// 切换登录方式
const toggleLoginMethod = (method: 'password' | 'verification') => {
   loginMethod.value = method;
};

// 登录表单数据
const loginForm = reactive({
   userAccount: 'music123',
   userPassword: '12345678'
});

// 注册表单数据
const registerForm = reactive({
   checkPassword: '12345678',
   planetCode: '',
   userAccount: '1411369154@qq.com',
   userPassword: '12345678'
});

// 验证码倒计时
const countdown = ref(0);
let countdownTimer: number | null = null;

// 发送验证码
type SendType = 'login' | 'register';
const sendVerificationCode = async () => {
   if (!registerForm.userAccount) {
      uni.showToast({
         title: '请先输入账号',
         icon: 'none'
      });
      //判断是否是邮箱格式

      return;
   }
   //判断是否是邮箱格式
   if (
      !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
         registerForm.userAccount
      )
   ) {
      uni.showToast({
         title: '请输入正确的邮箱格式',
         icon: 'none'
      });
      return;
   }

   // 在实际应用中，这里应该调用API发送验证码

   let res = await UserGetVerifyCode({ email: registerForm.userAccount });

   if (res.code === 0) {
      uni.showToast({
         title: '验证码已发送',
         icon: 'none'
      });
      startCountdown();
   }
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

      // 根据登录方式进行不同的验证
      if (loginMethod.value === 'password') {
         if (!loginForm.userPassword) {
            uni.showToast({
               title: '请输入密码',
               icon: 'none'
            });
            return false;
         }
      } else {
         if (!loginForm.planetCode) {
            uni.showToast({
               title: '请输入验证码',
               icon: 'none'
            });
            return false;
         }
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
      if (registerForm.userPassword !== registerForm.checkPassword) {
         uni.showToast({
            title: '两次密码输入不一致',
            icon: 'none'
         });
         return false;
      }
      if (!registerForm.planetCode) {
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
   if (!validateForm('login')) return;

   UserLogin(loginForm).then(res => {
      if (res.code == 0) {
         store.setUserInfo(res.data);
         store.setTokens({ ...res.data, tokens: loginForm, is_default: 1 });
         if (webstore.$state.SocketTask) {
            webstore.$state.SocketTask.close(); //关闭连接
         }
         setTimeout(() => {
            webstore.websocke(res.data.id);
         }, 1000);

         uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500,
            success: () => {
               // 延迟跳转防止提示被覆盖
               setTimeout(() => {
                  router.pushTab('/pages/tabar/home/index');
               }, 1500);
            }
         });
      }
   });
};

// 处理注册
const handleRegister = async () => {
   if (!validateForm('register')) return;

   // 模拟注册成功

   let res = await UserRegister(registerForm);
   if (res.code == 0) {
      uni.showToast({
         title: '注册成功',
         icon: 'success',
         duration: 1500,
         success: () => {
            // 延迟跳转防止提示被覆盖
            store.setUserInfo(res.data);
            store.setTokens({
               ...res.data,
               tokens: {
                  userAccount: registerForm.userAccount,
                  userPassword: registerForm.userPassword
               },
               is_default: 1
            });
            if (webstore.$state.SocketTask) {
               webstore.$state.SocketTask.close(); //关闭连接
            }
            setTimeout(() => {
               webstore.websocke(res.data.id);
            }, 1000);
            setTimeout(() => {
               router.push({
                  path: '/pages/login/personal/index'
               });
            }, 1500);
         }
      });
   }
   // store.setUserInfo(registerForm.userAccount);

   // // 显示注册成功提示
};

// 新增的辅助变量和方法
const current = ref(false);
const pageTitle = ref('账号登录');
const isHome = ref(false);
const colorStyle = ref({
   '--view-theme': '#0BD9EE'
});

const back = () => {
   router.back();
};

const home = () => {
   router.pushTab('/pages/tabar/home/index');
};
</script>

<style lang="scss" scoped>
// 淡入动画
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

// 抖动动画（补充原缺失的动画定义）
@keyframes shake {
   0%,
   100% {
      transform: translateX(0);
   }
   20% {
      transform: translateX(-6rpx);
   }
   40% {
      transform: translateX(6rpx);
   }
   60% {
      transform: translateX(-4rpx);
   }
   80% {
      transform: translateX(4rpx);
   }
}

// 复选框样式（修复深度选择器语法）
::v-deep checkbox .wx-checkbox-input.wx-checkbox-input-checked {
   border: 1px solid var(--view-theme) !important;
   background-color: var(--view-theme) !important;
   width: 28rpx;
   height: 28rpx;
   font-size: 24rpx;
   color: #fff !important;
   display: flex;
   align-items: center;
   justify-content: center;
}

// 页面容器
.wrapper {
   background-color: #fff;
   min-height: 100vh;
   position: relative;
   padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

// 背景图区域
.bag {
   position: absolute;
   top: var(--status-bar-height);
   left: 0;
   width: 100%;
   bottom: 0;
   height: 100vw;
   z-index: 0;
}

// 页面信息区
.page-msg {
   padding-top: 160rpx;
   margin-left: 72rpx;
   z-index: 2;
   position: relative;
   max-width: calc(100% - 144rpx);

   .title {
      font-size: 48rpx;
      font-weight: 500;
      color: #333;
      line-height: 68rpx;
      margin: 0 0 16rpx 0;
   }

   .tip {
      font-size: 28rpx;
      font-weight: 400;
      color: #666;
      line-height: 40rpx;
      margin: 0;
   }
}

// 登录方式切换样式
.login-method-switch {
   display: flex;
   margin-bottom: 32rpx;
   border-radius: 45rpx;
   background: #f5f5f5;
   overflow: hidden;

   .method-tab {
      flex: 1;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      font-size: 30rpx;
      color: #666;
      transition: all 0.3s ease;

      &.active {
         background: var(--view-theme);
         color: #fff;
      }
   }
}

// 表单区域
.page-form {
   box-sizing: border-box;
   width: 606rpx;
   margin: 100rpx auto 0;
   z-index: 2;
   position: relative;

   .item {
      box-sizing: border-box;
      width: 100%;
      height: 88rpx;
      background: #f5f5f5;
      border-radius: 45rpx;
      padding: 0 48rpx;
      margin-bottom: 32rpx;
      display: flex;
      align-items: center;

      input {
         width: 100%;
         height: 100%;
         font-size: 32rpx;
         background: transparent;
         border: none;
         outline: none;
         color: #333;

         &::placeholder {
            color: #bbb;
            font-size: 28rpx;
         }
      }
   }

   // 验证码输入框（修复类名拼写错误 codeIput → codeInput）
   input.codeInput {
      width: 300rpx;
      margin-right: 24rpx;
   }

   .line {
      width: 2rpx;
      height: 28rpx;
      background: #ccc;
      margin: 0 16rpx;
   }

   .code {
      color: #1aad19;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 0 8rpx;

      &.on {
         color: #bbb !important;
         cursor: not-allowed;
      }
   }
}

// 标题栏（修复选择器，若为组件建议用类名）
.title-bar {
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   height: 80rpx;
   font-size: 34rpx;
   font-weight: 500;
   color: #333;
   line-height: 48rpx;

   .icon {
      position: absolute;
      left: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 80rpx;
      cursor: pointer;

      image {
         width: 35rpx;
         height: 35rpx;
         object-fit: contain;
      }
   }
}

// 底部协议
.protocol {
   position: fixed;
   bottom: 52rpx;
   left: 0;
   width: 100%;
   margin: 0 auto;
   color: #999;
   font-size: 24rpx;
   line-height: 36rpx;
   text-align: center;
   padding: 0 40rpx;
   bottom: calc(52rpx + constant(safe-area-inset-bottom));
   bottom: calc(52rpx + env(safe-area-inset-bottom));
}

// 主题色类
.main-color {
   color: var(--view-theme) !important;
}

// 抖动动画类
.trembling {
   animation: shake 0.6s ease-in-out;
}

// 淡入动画类
.animate-fadeIn {
   animation: fadeIn 0.3s ease-out forwards;
}
</style>
