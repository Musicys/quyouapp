import { defineStore } from 'pinia';
import { ref } from 'vue';
export const sockeStore = defineStore(
   'socke',
   () => {
      //消息列表
      const UserTilteList = ref([]);
      //用户列表
      const UserList = ref([]);
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
            url: `ws://localhost:8080/api/websocket/${id}`, // WebSocket 地址
            // #endif
            success: () => {
               console.log('WebSocket 连接创建成功');
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

            //好友列表
            if (resd.type == 1) {
               //执行

               UserList.value = resd.data;
            }

            //登录状态
            if (resd.type == 2) {
               for (let i = 0; i < UserList.value.length; i++) {
                  if (UserList.value[i].id == resd.data.id) {
                     UserList.value[i].login = resd.data.login;
                  }
               }
            }

            //添加消息

            if (resd.type == 3) {
               for (let i = 0; i < UserList.value.length; i++) {
                  // console.log("响应数据0",UserList.value[i].id,resd.data.userid ,resd.data.sendid);
                  if (
                     UserList.value[i].id == resd.data.userid ||
                     UserList.value[i].id == resd.data.sendid
                  ) {
                     console.log(
                        typeof UserList.value[i].sendList,
                        UserList.value[i].sendList
                     );
                     UserList.value[i].sendList.push(resd.data);
                  }
               }
            }

            //添加好友列表
            if (resd.type == 4) {
               //
               UserList.value.push(resd.data);
            }
         });
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

      return { UserList, websocke, send, UserTilteList, SocketTask };
   },
   {
      unistorage: true // 开启后对 state 的数据读写都将持久化
   }
);
