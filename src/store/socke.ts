import { defineStore } from 'pinia';
import { ref } from 'vue';
export const sockeStore = defineStore('socke', () => {
   //消息列表
   const UserTilteList = ref([]);
   //用户列表
   const UserList = ref([]);
   const ChatList = ref([]);
   const SocketTask = ref(null);
   // 创建 WebSocket 连接
   const websocke = id => {
      if (SocketTask.value) {
         //关闭连接
         try {
            SocketTask.value.close();
         } catch (e) {
            console.log('关闭连接错误', e);
         }
         SocketTask.value = null;
      }

      SocketTask.value = uni.connectSocket({
         // #ifdef APP-PLUS
         url: `ws://101.42.172.99:8080/api/websocket/${id}`, // WebSocket 地址
         // #endif
         // #ifdef H5
         url: import.meta.env.VITE_APP_WS_WEBSCOKE
            ? import.meta.env.VITE_APP_WS_WEBSCOKE + `/api/websocket/${id}`
            : `ws://${window.location.host}/api/websocket/${id}`, // WebSocket 地址

         // #endif
         success: () => {
            console.log(
               'WebSocket 连接创建成功',
               import.meta.env.VITE_APP_WS_WEBSCOKE
            );
         },
         fail: err => {
            console.error('WebSocket 连接创建失败', err);
            // setTimeout(() => {
            //    websocke(id);
            // }, 1000);
         }
      });

      // 监听 WebSocket 错误事件
      SocketTask.value.onError(err => {
         console.error('WebSocket 错误', err);
         // setTimeout(() => {
         //    websocke(id);
         // }, 1000);
      });

      // 监听 WebSocket 关闭事件
      SocketTask.value.onClose(() => {
         console.log('WebSocket 已关闭');
      });

      SocketTask.value.onMessage(res => {
         const resd = JSON.parse(`${res.data}`);
         console.log('WebSocket 接收到消息', resd);
         //好友列表
         if (resd.type == 1) {
            //执行

            UserList.value = resd.userData;
            ChatList.value = resd.chatData.chatList;
         }

         //登录状态
         if (resd.type == 2) {
            for (let i = 0; i < UserList.value.length; i++) {
               if (UserList.value[i].id == resd.userData.id) {
                  UserList.value[i].login = resd.userData.login;
               }
            }
         }

         //添加消息

         if (resd.type == 3) {
            for (let i = 0; i < UserList.value.length; i++) {
               // console.log("响应数据0",UserList.value[i].id,resd.userData.userid ,resd.userData.sendid);
               if (
                  UserList.value[i].id == resd.userData.userid ||
                  UserList.value[i].id == resd.userData.sendid
               ) {
                  console.log(
                     typeof UserList.value[i].sendList,
                     UserList.value[i].sendList
                  );
                  UserList.value[i].sendList.push(resd.userData);
               }
            }
         }

         //添加好友列表
         if (resd.type == 4) {
            //
            UserList.value.push(resd.userData);
         }

         //群聊
         if (resd.type == 5) {
            for (let i = 0; i < ChatList.value.length; i++) {
               if (ChatList.value[i].id == resd.userData.chatid) {
                  ChatList.value[i].lookCount += 1;
                  ChatList.value[i].sendList.push(resd.userData);
               }
            }
         }

         //群公告
         if (resd.type == 6) {
            for (let i = 0; i < ChatList.value.length; i++) {
               if (ChatList.value[i].id == resd.chatData.chatid) {
                  ChatList.value[i].lookCount += 1;
                  console.log('soke', ChatList.value[i]);

                  ChatList.value[i].sendList.push(resd.chatData);
               }
            }
         }

         //添加群聊列表
         if (resd.type == 7) {
            ChatList.value.push(resd.chatData);
         }
      });
   };

   const IsFriend = (id: number) => {
      for (const item of UserList.value) {
         if (item.id == id) {
            return true;
         }
      }
      return false;
   };

   //消息改变成已读
   const setyellow = (userid: number, senid: number) => {
      for (let i = 0; i < UserList.value.length; i++) {
         if (UserList.value[i].id == senid) {
            for (let j = 0; j < UserList.value[i].sendList.length; j++) {
               if (UserList.value[i].sendList[j].sendid == userid) {
                  UserList.value[i].sendList[j].yeslook = '1';
                  console.log(UserList.value[i].sendList[j].yeslook);
               }
            }
         }
      }
   };

   const send = obj => {
      SocketTask.value.send({
         data: obj,
         success: () => {
            console.log('发送成功');
         },
         fail: err => {
            console.error('发送失败', err);
         }
      });
   };

   return {
      UserList,
      websocke,
      send,
      UserTilteList,
      SocketTask,
      IsFriend,
      setyellow,
      ChatList
   };
});
