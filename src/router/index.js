import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/home",
    hidden:true,//隐藏
    meta:{
      name:"控制台"
    },
  },
  {
    path: "/home",
    name: "Home",
    hidden:false,
    //自定义属性
    meta:{
      name:"控制台",
      icon:"工业组件-仪表盘"
    },
    component: () =>import( "../views/Layout/index.vue"),
    redirect:"/index",
    children:[
      {
        path: "/index",
        name: "HomeIndex",
        meta:{name:"首页"},
        component: () =>import( "../views/Home/index.vue"),
      }
        
    ]
  },
  //info
  {
    path: "/info",
    name: "Info",
    hidden:false,
    //自定义属性
    meta:{
      name:"信息管理",
      icon:"信息"
    },
    component: () =>import( "../views/Layout/index.vue"),
    children:[
      {
        path: "/infoIndex",
        name: "infoIndex",
        meta:{name:"信息列表"},
        component: () =>import( "../views/Info/index.vue"),
      },
      {
        path: "/infoCate",
        name: "infoCate",
        meta:{name:"信息分类"},
        component: () =>import( "../views/Info/cate.vue"),
      }
        
    ]
  },
  //User 用户
  {
    path: "/user",
    name: "User",
    hidden:false,
    //自定义属性
    meta:{
      name:"用户管理",
      icon:"user"
    },
    component: () =>import( "../views/Layout/index.vue"),
    children:[
      {
        path: "/userIndex",
        name: "userIndex",
        meta:{name:"用户列表"},
        component: () =>import( "../views/User/index.vue"),
      },
      {
        path: "/userCate",
        name: "userCate",
        meta:{name:"用户分类"},
        component: () =>import( "../views/User/cate.vue"),
      }
        
    ]
  },
  {
    path: "/login",
    name: "Login2",
    hidden:true,
    meta:{
      name:"用户管理"
    },
    component: () =>import( "../views/Login/vue.vue")
  }
 
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});



// localStorage.setItem('zhang',JSON.stringify({name:'lili',age:18}))//修改
// console.log(JSON.parse(localStorage.getItem('zhang')))//获取


//路由守卫  登陆了才能跳转
router.beforeEach((to,from,next)=>{
  // console.log(to)//从哪里来
  // console.log(from)//到哪里去
  // console.log(next)
  // const isLogin =localStorage.getItem('ele_login') ?true :false
  // if(to.path==="/login"){
  //    next()//接着往下走
  // }else{
  //   //是否登录  没有登录重定向登录页面  如果登录就正常next
  //   isLogin ? next() : next("./login")
  // }
  next()
})




export default router;
