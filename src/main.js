import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//导入css入口文件
import "./styles/main.scss"

//sass预编译器 程序的编辑器css 
//sass --> sass-loader  --> css --> css-loader -->js模块 -->利用webpack  -->  style-loader -->style标签中的dom元素

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
