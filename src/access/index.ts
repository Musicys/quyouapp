import router from '@/router';

router.beforeEach((to, from, next) => {
   // next入参 false 以取消导航

   console.log('前置');
   next(true);
});
router.afterEach((to, from) => {
   console.log('后置');

   console.log(to);
   console.log(from);
});
