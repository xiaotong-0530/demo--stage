import axios from "axios";
import {Message} from "element-ui"
import {getToken,getUsername} from "./cookie"
const BSSEURL=process.env.NODE_ENV==='development' ? '/api' : ''

const http =axios.create({
    baseURL:BSSEURL //http://localhost:8081/api/getSms/  只要url中以/api开头的都是接口请求
})
//跨域 指的是浏览器由于同源策略 不同域名的请求  就会出现跨域  但是如果是两个后台发起网络请求就不存在跨域了
// http.defaults.baseURL="http://www.web-jshtml.cn/file/api.html"      //"https://www.baidu.com/"

const tokenwhite=['/getSms/','/login/','/register/']
// 添加请求拦截器
http.interceptors.request.use(function (config) {
    //手动添加请求数据头参数 token userId csrf
    
    if(tokenwhite.indexOf(config.url)!==-1){
      return config;
    }else{
      if(getToken() && getUsername()){
        config.headers.Tokey=getToken()
        config.headers.username=getUsername()
        return config;
      }else{//如果将本地的token删除以后再提交
        const message="token或者用户名失败 请重新登录"
        Message.error(message);
        return Promise.reject({error:message});
      }
    }
    // console.log("请求参数",config.headers)
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if(response.data.resCode!=0){
        //提示浏览器返回的信息
        Message.error(response.data.message);
        return Promise.reject({error:response.data.message});
    }   
    return response
    
  }, function (error) {
    // 对响应错误做点什么
    console.log("响应拦截")
    return Promise.reject(error);
});

export default http;

