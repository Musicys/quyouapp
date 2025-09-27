export interface Dynamic {
   id: number;
   context: string;
   lat: number;
   lng: number;
   imgarr: string[]; // imgarr 字段是一个包含字符串的数组
   distance: number;
   formatted: string;
   count: number;
   love: number;
   userId: number;
   userAccount: string;
   gender: number; // 通常 1 表示男性，0 表示女性，可根据实际业务调整
   age: number;
   avatarUrl: string;
   province: string;
   district: string;
}
