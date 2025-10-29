// 格式化消息时间
export const formatMessageTime = (timeString?: string): string => {
   if (!timeString) return '';

   const messageTime = new Date(timeString);
   const now = new Date();
   const diffMs = now.getTime() - messageTime.getTime();
   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

   if (diffDays === 0) {
      // 今天，只显示时间
      return messageTime.toLocaleTimeString('zh-CN', {
         hour: '2-digit',
         minute: '2-digit'
      });
   } else if (diffDays < 7) {
      // 一周内
      return `${diffDays}天前`;
   } else if (diffDays < 30) {
      // 一个月内
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
   } else {
      // 一个月以上
      return `${Math.floor(diffDays / 30)}个月前`;
   }
};
