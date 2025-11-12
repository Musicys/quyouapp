/**
 * @description 防抖
 * @param function, number
 * @returns Funtion
 */

export function debounce<T extends (...args: any[]) => any>(
   func: T,
   wait: number
): (...args: Parameters<T>) => void {
   let timeoutId: ReturnType<typeof setTimeout> | null = null;

   return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      // 清除上一次的定时器
      if (timeoutId) {
         clearTimeout(timeoutId);
      }

      // 重新设置定时器
      timeoutId = setTimeout(() => {
         func.apply(this, args);
         timeoutId = null;
      }, wait);
   };
}
/**
 * @description 节流
 * @param function
 * @param number
 * @returns Funtion
 */
export function throttle<T extends (...args: any[]) => any>(
   func: T,
   wait: number
): (...args: Parameters<T>) => void {
   let timeoutId: ReturnType<typeof setTimeout> | null = null;

   return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (!timeoutId) {
         timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
         }, wait);
      }
   };
}
/**
 * 计算两个经纬度之间的距离（单位：米）
 * @param {number} lat1 - 第一个点的纬度
 * @param {number} lng1 - 第一个点的经度
 * @param {number} lat2 - 第二个点的纬度
 * @param {number} lng2 - 第二个点的经度
 * @returns {number} 距离（米）
 */
export function getDistance(lat1, lng1, lat2, lng2) {
   const R = 6371000; // 地球半径，单位：米

   const dLat = ((lat2 - lat1) * Math.PI) / 180;
   const dLng = ((lng2 - lng1) * Math.PI) / 180;

   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
         Math.cos((lat2 * Math.PI) / 180) *
         Math.sin(dLng / 2) *
         Math.sin(dLng / 2);

   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

   return R * c; // 返回距离，单位：米
}

/**
 * @description 法松格式化消息时间
 * @param timeString
 * @returns
 */
export const formatMessageTime = (timeString?: string): string => {
   if (!timeString) return '';

   let messageTime: Date;

   try {
      // 🔧 关键修复：检测并修正 Java 的 Date.toString() 产生的 CST 时区歧义
      if (typeof timeString === 'string' && /CST/.test(timeString)) {
         // 将 "CST" 替换为 "+0800"，这是一种 JavaScript 能明确识别为 UTC+8 的格式
         // 示例: "Mon Nov 03 23:01:43 CST 2025" -> "Mon Nov 03 23:01:43 +0800 2025"
         const correctedTimeString = timeString.replace(/\bCST\b/g, '+0800');

         messageTime = new Date(correctedTimeString);

         // 验证日期是否有效
         if (isNaN(messageTime.getTime())) {
            console.warn(
               `Failed to parse corrected date string: ${correctedTimeString}`
            );
            // 如果修正后失败，回退到原始字符串（可能仍有问题，但至少尝试了）
            messageTime = new Date(timeString);
         }
      } else {
         // 如果不包含 CST，则按原样解析
         messageTime = new Date(timeString);
      }

      // 再次检查最终的日期对象是否有效
      if (isNaN(messageTime.getTime())) {
         console.error('Invalid date after all parsing attempts:', timeString);
         return '';
      }
   } catch (error) {
      console.error('Error parsing date string:', timeString, error);
      return '';
   }

   const now = new Date();

   // 计算时间差的绝对值（毫秒）
   const diffMs = Math.abs(now.getTime() - messageTime.getTime());
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
