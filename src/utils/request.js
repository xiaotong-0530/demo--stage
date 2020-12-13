import axios from "axios";
import {Message} from "element-ui"
// import {getToken} from "./cookie"
const BSSEURL=process.env.NODE_ENV==='development' ? '/api' : ''

const http =axios.create({
    baseURL:BSSEURL //http://localhost:8081/api/getSms/  只要url中以/api开头的都是接口请求
})
//跨域 指的是浏览器由于同源策略 不同域名的请求  就会出现跨域  但是如果是两个后台发起网络请求就不存在跨域了
// http.defaults.baseURL="http://www.web-jshtml.cn/file/api.html"      //"https://www.baidu.com/"

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // console.log("请求拦截")

    //手动添加请求数据头参数 token userId csrf
    // if(getToken){
    //   config.headers.token=getToken()
    // }
    
    console.log("请求参数",config.headers)

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    if(response.data.resCode!=0){
        //提示浏览器返回的信息
        Message.error(response.data.message);
        return Promise.reject(error);
    }   
    return response
    
  }, function (error) {
    // 对响应错误做点什么
    console.log("响应拦截")
    return Promise.reject(error);
});

export default http;

