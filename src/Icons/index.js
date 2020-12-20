import Vue from "vue";
import Svgicon from "./component/Svgicon.vue"
//声明全局组件
Vue.component("svg-icon",Svgicon)

//读取svg文件 ./svg/xxx.svg
/*
    第一个：目录
    第二个：是否遍历子级目录
    第三个：定义遍历文件规则

*/
//1.读取svg文件 转化成webpack能访问的资源(对象) 
const req = require.context('./svg', false, /\.svg$/) //交给webpack处理
// console.log(req.keys())//打印所有是图标icon
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)

// req.keys().map(req)

//2.配置webpack

//3.下载loader
// npm install svg-sprite-loader -S
