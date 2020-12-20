import router from "./index"
import {getToken} from "../utils/cookie"
import {removeUsername,removeToken} from "../utils/cookie"
import store from '../store/index'
//白名单
const writerRouter=['/login',"/home","/detail"]

// 路由相关编辑
router.beforeEach((to,from,next)=>{
    //判断登录的唯一标识是token是否存在
    if(getToken()){
        //存在  登录了
        if(to.path ==="/login"){//如果访问的话就重新登录
            //进行清除
            removeUsername()
            removeToken()
            //清理vuex的错误
            store.commit("app/SET_USERNAME","")
            store.commit("app/SET_TOKEN","")
        }
        next()
    }else{
        if(writerRouter.indexOf(to.path)!==-1){
            next() //如果访问的是登录此时应该执行next()
        }else{
            next("/login")  //不存在  未登录  跳转到登录页面执行登录
        }
    }
})


