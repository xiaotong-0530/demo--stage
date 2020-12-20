import Vue from "vue";
import App from "./App.vue";
import router from "./router";
//导入路由权限
// import "./router/permit"
import store from "./store";
// icon图标
import "./Icons/index"

//导入css入口文件
import "./styles/main.scss"

//2.0转换3.0
import VueCompositionApi from '@vue/composition-api'; 
Vue.use(VueCompositionApi);

//引入axios
import axios from 'axios'
Vue.prototype.$http= axios

//系统默认的环境变量
// console.log(process.env.NODE_ENV)   //development
//注入全局 2.0
// import Global from './utils/global' // 引入
// Vue.use(Global) // 添加
  











// console.log(process.env)

/*自定义环境变量
    如果是线下  npm run serve
        默认参数  .env.development

    如果是线上  npm run bulid
        默认读取  .env.production
*/


//sass预编译器 程序的编辑器css 
//sass --> sass-loader  --> css --> css-loader -->js模块 -->利用webpack  -->  style-loader -->style标签中的dom元素

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
