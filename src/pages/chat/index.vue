<template>
   <view class="chat-page">
      <!-- 导航栏区域 -->
      <wd-navbar left-arrow @click-left="handleClickLeft">
         <template #title>{{ friendInfo.username || '聊天' }}</template>
         <template #right>
            <wd-button type="success" size="small" @click="toggleFollow">{{
               followText
            }}</wd-button>
            <wd-icon
               name="decrease"
               size="22px"
               @click="showMoreOptions"></wd-icon>
         </template>
      </wd-navbar>
      <view class="chat-nav">
         <!-- 人物卡片区域 -->
         <view class="user-card">
            <view class="avatar-container">
               <view class="avatar">
                  <image :src="friendInfo.avatarUrl" mode="aspectFill"></image>
               </view>
               <view
                  :class="[
                     'online-status',
                     { online: friendInfo.login === 1 }
                  ]"></view>
            </view>
            <view class="user-info">
               <view class="name-age">
                  <text class="name">{{ friendInfo.username }}</text>
                  <text class="age">{{ friendInfo.age }}岁</text>
                  <text class="gender">{{
                     friendInfo.gender === 1 ? '♂' : '♀'
                  }}</text>
               </view>
               <view class="tags">
                  <text
                     v-for="(tag, index) in friendInfo.tags"
                     :key="index"
                     class="tag-item"
                     >{{ tag }}</text
                  >
               </view>
               <view class="intro">{{ friendInfo.introductory }}</view>
            </view>
         </view>
      </view>

      <!-- 聊天区域 -->
      <scroll-view
         class="chat-area"
         scroll-y
         :scroll-top="bottomsize"
         :scroll-with-animation="true"
         :show-scrollbar="false">
         <view class="bottom-placeholder">
            <view
               v-for="(msg, index) in messages"
               :key="index"
               :class="['msg-item', msg.isMine ? 'mine' : 'other']">
               <!-- 自己的消息 -->
               <template v-if="msg.isMine">
                  <view class="avatar">
                     <image
                        :src="userInfo.avatarUrl || '默认头像URL'"
                        mode="aspectFill"></image>
                  </view>
                  <view class="msg-content">
                     <view v-if="msg.type === 'text'" class="text-msg">
                        <text>
                           {{ msg.content }}
                        </text>
                     </view>
                     <view v-else-if="msg.type === 'image'" class="image-msg">
                        <image :src="msg.content" mode="aspectFill"></image>
                     </view>
                     <view v-else-if="msg.type === 'voice'" class="voice-msg">
                        <wot-icon
                           name="voice"
                           color="#666"
                           size="20"></wot-icon>
                        <text class="voice-duration">{{ msg.duration }}''</text>
                     </view>
                     <text class="msg-time">{{ msg.time }}</text>
                  </view>
               </template>
               <!-- 对方的消息 -->
               <template v-else>
                  <view class="avatar">
                     <image
                        :src="friendInfo.avatarUrl || '默认头像URL'"
                        mode="aspectFill"></image>
                  </view>
                  <view class="msg-content">
                     <view v-if="msg.type === 'text'" class="text-msg">
                        {{ msg.content }}
                     </view>
                     <view v-else-if="msg.type === 'image'" class="image-msg">
                        <image :src="msg.content" mode="aspectFill"></image>
                     </view>
                     <view v-else-if="msg.type === 'voice'" class="voice-msg">
                        <wot-icon
                           name="voice"
                           color="#666"
                           size="20"></wot-icon>
                        <text class="voice-duration">{{ msg.duration }}''</text>
                     </view>
                     <text class="msg-time">{{ msg.time }}</text>
                  </view>
               </template>
            </view>
         </view>
      </scroll-view>

      <!-- 消息输入区域 -->
      <view class="input-area">
         <view class="input-left">
            <input
               v-if="inputType === 'text'"
               v-model="inputValue"
               placeholder="请输入消息..."
               auto-height="false"
               type="text"
               confirm-type="send"
               @confirm="sendMsg"
               class="text-input" />
            <view
               v-else
               class="voice-holder"
               @longpress="startRecord"
               @touchend="endRecord">
               按住说话
            </view>
            <wot-icon
               name="smile"
               color="#999"
               size="28"
               @click="toggleEmojiPanel"></wot-icon>
         </view>
         <view class="input-right">
            <wd-button type="success" class="send-btn" @click="sendMsg"
               >发送</wd-button
            >
         </view>
      </view>

      <!-- 底部功能区域 -->
      <view class="bottom-func">
         <view class="func-item" @click="openImagePicker">
            <wot-icon name="image" color="#666" size="24"></wot-icon>
            <text>图片</text>
         </view>
         <view class="func-item" @click="makeCall">
            <wot-icon name="phone" color="#666" size="24"></wot-icon>
            <text>电话</text>
         </view>
         <view class="func-item" @click="showHotTags">
            <wot-icon name="tag" color="#666" size="24"></wot-icon>
            <text>热门标签</text>
         </view>
         <view class="func-item" @click="showMoreFunc">
            <wot-icon name="more" color="#666" size="24"></wot-icon>
            <text>更多</text>
         </view>
      </view>

      <!-- 表情面板（默认隐藏） -->
      <view v-show="showEmojiPanel" class="emoji-panel">
         <!-- 表情内容，这里简化示例 -->
         <view class="emoji-item" @click="selectEmoji('😄')">😄</view>
         <view class="emoji-item" @click="selectEmoji('😊')">😊</view>
         <view class="emoji-item" @click="selectEmoji('❤️')">❤️</view>
      </view>
   </view>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'uni-mini-router';
import { nextTick, onMounted, ref, watch } from 'vue';
import { sockeStore } from '@/store/socke';
import { useStore } from '@/store/user';
import { UpdateSendsye } from '@/api/wbscoke';

const { userInfo } = useStore();
const soke = sockeStore();
const { send, UserList } = soke;
const route = useRoute();
const router = useRouter();
// 消息列表
const messages = ref([]);
const bottomsize = ref<number>(0);
// 输入相关
const inputValue = ref('');
const inputType = ref('text'); // text/voice
const showEmojiPanel = ref(false);
// 关注相关
const isFollowed = ref(false);
const followText = ref(isFollowed.value ? '已关注' : '关注');
// 好友信息
const friendInfo = ref({
   avatarUrl: '',
   username: '',
   age: 0,
   login: 0,
   sendList: [],
   id: ''
});
onMounted(() => {
   const sendid = route.query.sendid || '';

   try {
      // 尝试从store获取用户信息
      const index = UserList.findIndex(item => item.id == sendid);
      if (sendid !== '' && index !== -1) {
         UpdateSendsye(sendid).then(res => {
            console.log(res);
         });
         friendInfo.value = UserList[index];
      }
      updateMessages();
   } catch (error) {
      console.error('处理用户数据失败:', error);
   }
});
// 监听sendList变化
watch(
   () => UserList,
   () => {
      updateMessages();
   },
   { deep: true }
);

// 滚动到底部函数
const scrollToBottom = () => {
   nextTick(() => {
      let query = uni.createSelectorQuery().in(this);
      query
         .select('.bottom-placeholder')
         .boundingClientRect(res => {
            console.log('Node Info:', res.height);
            setTimeout(() => {
               bottomsize.value = res.height;
            }, 100);
         })
         .exec();
      query = null;
   });
};

// 监听friendInfo.value.sendList变化，同步到messages

const updateMessages = () => {
   if (friendInfo.value.sendList && friendInfo.value.sendList.length > 0) {
      messages.value = friendInfo.value.sendList.map(msg => ({
         content: msg.context,
         type: 'text',
         time: formatTime(msg.createtime),
         isMine: msg.userid == userInfo.id // 假设当前用户ID是26758
      }));
   } else {
      // 如果没有消息，设置默认消息
      messages.value = [
         {
            content: '你好啊，我们开始聊天把-.-',
            type: 'text',
            time: '2025-08-20 14:09:22',
            isMine: false
         }
      ];
   }
   scrollToBottom();
};

// 格式化时间
const formatTime = timeStr => {
   try {
      const date = new Date(timeStr);
      return date
         .toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
         })
         .replace(/\//g, '-');
   } catch {
      return timeStr;
   }
};

// 返回
const goBack = () => {
   uni.navigateBack();
};

const toggleFollow = () => {
   isFollowed.value = !isFollowed.value;
   followText.value = isFollowed.value ? '已关注' : '关注';
};

// 显示更多选项
const showMoreOptions = () => {
   uni.showActionSheet({
      itemList: ['设置聊天背景', '清空聊天记录', '取消'],
      success: res => {
         if (res.tapIndex === 0) {
            // 设置聊天背景逻辑
         } else if (res.tapIndex === 1) {
            // 在实际应用中，这里应该调用API清空聊天记录，然后等待friendInfo.value.sendList更新
         }
      }
   });
};

// 切换输入类型（文字/语音）
const toggleInputType = (type: string) => {
   inputType.value = type;
};

// 切换表情面板显示
const toggleEmojiPanel = () => {
   showEmojiPanel.value = !showEmojiPanel.value;
};

// 选择表情
const selectEmoji = (emoji: string) => {
   inputValue.value += emoji;
};

// 开始录音
const startRecord = () => {
   // 录音逻辑，uniapp可调用uni.startRecord
   uni.showToast({
      title: '开始录音',
      icon: 'none'
   });
};

// 结束录音
const endRecord = () => {
   // 结束录音逻辑，uniapp可调用uni.stopRecord
   uni.showToast({
      title: '录音结束',
      icon: 'none'
   });
   // 在实际应用中，这里应该调用API发送语音消息，然后等待friendInfo.value.sendList更新
};

// 发送消息
const sendMsg = () => {
   if (inputValue.value.trim() === '') return;
   // 在实际应用中，这里应该调用API发送消息，然后等待friendInfo.value.sendList更新
   // 1. 替换所有换行符为标准 \n
   let message = inputValue.value.replace(/\r\n|\r|\n/g, '\n');

   // 2. 可选：将多个连续空白（空格、制表符等）压缩为一个空格
   message = message.replace(/[^\S\n]+/g, ' '); // 只压缩非换行的空白

   // 3. 去除首尾空白（包括换行和空格）
   message = message.trim();

   soke.send(
      JSON.stringify({
         id: userInfo.id,
         type: 3,
         sendid: friendInfo.value.id,
         sendteam: null,
         context: message,
         senTime: new Date()
      })
   );
   inputValue.value = '';
};

const handleClickLeft = () => {
   uni.navigateBack();
};
// 打开图片选择器
const openImagePicker = () => {
   uni.chooseImage({
      count: 1,
      success: res => {
         const tempFilePath = res.tempFilePaths[0];
         // 在实际应用中，这里应该调用API发送图片，然后等待friendInfo.value.sendList更新
      }
   });
};

// 拨打电话
const makeCall = () => {
   uni.makePhoneCall({
      phoneNumber: '10086' // 实际替换为对方号码
   });
};

// 显示热门标签
const showHotTags = () => {
   uni.showModal({
      title: '热门标签',
      content: '电影、动漫、美食、旅行',
      showCancel: false
   });
};

// 显示更多功能
const showMoreFunc = () => {
   uni.showActionSheet({
      itemList: ['位置共享', '文件传输', '其他'],
      success: res => {
         // 根据tapIndex处理对应逻辑
      }
   });
};
</script>

<style lang="scss" scoped>
$theme-color: #ff6b6b;
$light-gray: #f5f5f5;
$border-color: #eee;
$online-green: #52c41a;

.chat-page {
   display: flex;
   flex-direction: column;
   width: 100vw;
   height: 100vh;
   background-color: $light-gray;
}

.chat-nav {
   background-color: #fff;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-card {
   padding: 15px;
   background-color: #fff;
   .avatar-container {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 10px;
      .avatar {
         width: 100%;
         height: 100%;
         border-radius: 50%;
         overflow: hidden;
         border: 2px solid #f0f0f0;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .online-status {
         position: absolute;
         bottom: 0;
         right: 0;
         width: 16px;
         height: 16px;
         border-radius: 50%;
         background-color: #ccc;
         border: 2px solid #fff;
         &.online {
            background-color: $online-green;
         }
      }
   }
   .user-info {
      text-align: center;
      margin-bottom: 10px;
      .name-age {
         display: flex;
         align-items: center;
         justify-content: center;
         margin-bottom: 5px;
         .name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-right: 8px;
         }
         .age {
            font-size: 14px;
            color: #666;
            margin-right: 5px;
         }
         .gender {
            font-size: 16px;
            color: $theme-color;
         }
      }
      .intro {
         text-align: center;
         color: #666;
         font-size: 14px;
         line-height: 1.4;
         padding: 0 10px;
      }
   }
   .tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 5px;
      .tag-item {
         padding: 3px 8px;
         background-color: $light-gray;
         border-radius: 10px;
         margin: 3px;
         font-size: 12px;
         color: #666;
      }
   }
}

.chat-area {
   flex: 1;
   padding: 10px;
   background-color: $light-gray;
   overflow-y: auto; /* 添加滚动条 */
   .msg-item {
      margin-bottom: 15px;
      display: flex;

      &.mine {
         flex-direction: row-reverse;
         .msg-content {
            .text-msg {
               background-color: #a2e39c;
               color: #333;
            }
            .image-msg image {
               border: 1px solid #a2e39c;
            }
            .voice-msg {
               background-color: #a2e39c;
            }
            .msg-time {
               text-align: right;
            }
         }
      }
      &.other {
         flex-direction: row;
         .msg-content {
            .text-msg {
               background-color: #fff;
               color: #333;
            }
            .image-msg image {
               border: 1px solid #fff;
            }
            .voice-msg {
               background-color: #fff;
            }
         }
      }
      .avatar {
         width: 40px;
         height: 40px;
         border-radius: 50%;
         overflow: hidden;
         margin: 0 10px;
         image {
            width: 100%;
            height: 100%;
         }
      }
      .msg-content {
         max-width: 70%;
         .text-msg {
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 3px;
            word-break: break-all;
         }
         .image-msg image {
            width: 200px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 3px;
         }
         .voice-msg {
            display: flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 3px;
            .voice-duration {
               margin-left: 5px;
               font-size: 12px;
            }
         }
         .msg-time {
            font-size: 10px;
            color: #999;
            display: block;
         }
      }
   }
}

.input-area {
   display: flex;
   align-items: center;
   padding: 10px;
   background-color: #fff;
   border-top: 1px solid $border-color;
   .input-left {
      flex: 1;
      display: flex;
      align-items: center;
      .text-input {
         flex: 1;
         height: 36px;
         line-height: 36px;
         padding: 0 8px;
         border: 1px solid #ddd;
         border-radius: 18px;
         margin: 0 8px;
      }
      .voice-holder {
         flex: 1;
         height: 36px;
         line-height: 36px;
         text-align: center;
         background-color: $light-gray;
         border-radius: 18px;
         margin: 0 8px;
      }
   }
   .input-right {
      .send-btn {
         width: 70px;
         height: 36px;
         line-height: 36px;
         background-color: $theme-color;
         color: #fff;
         border-radius: 18px;
         border: none;
      }
   }
}

.bottom-func {
   display: flex;
   justify-content: space-around;
   padding: 10px 0;
   background-color: #fff;
   border-top: 1px solid $border-color;
   .func-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text {
         font-size: 12px;
         color: #666;
         margin-top: 5px;
      }
   }
}

.emoji-panel {
   position: fixed;
   bottom: 120px;
   left: 0;
   right: 0;
   background-color: #fff;
   padding: 10px;
   display: flex;
   flex-wrap: wrap;
   .emoji-item {
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 20px;
      margin: 5px;
   }
}
</style>
