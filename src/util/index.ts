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
