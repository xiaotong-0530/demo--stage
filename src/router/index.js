import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "Home",
    component: () =>import( "../views/Home/index.vue")
  },
  // {
  //   path: "/vue2.0",
  //   name: "Login1",
  //   component: () =>import( "../views/Login/vue2.0.vue")
  // },
  {
    path: "/login",
    name: "Login2",
    component: () =>import( "../views/Login/vue.vue")
  }
  // {
  //   path: "/login",
  //   name: "Login2",
  //   component: () =>import( "../views/Login/vue3.0.vue")
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});



// localStorage.setItem('zhang',JSON.stringify({name:'lili',age:18}))//修改
// console.log(JSON.parse(localStorage.getItem('zhang')))//获取


//路由守卫  登陆了才能跳转
// router.beforeEach((to,from,next)=>{
//   // console.log(to)//从哪里来
//   // console.log(from)//到哪里去
//   // console.log(next)
//   const isLogin =localStorage.getItem('ele_login') ?true :false
//   if(to.path==="/login"){
//      next()//接着往下走
//   }else{
//     //是否登录  没有登录重定向登录页面  如果登录就正常next
//     isLogin ? next() : next("./login")
//   }
 
// })




export default router;
