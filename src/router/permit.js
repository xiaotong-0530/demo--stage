import router from "./index"
import {getToken,removeUsername,removeToken} from "../utils/cookie"
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
            next()
          
        }else{
            /*
                权限判断--》 创建动态路由
                    1.时机:  ok
                    2.条件:  当前用户有什么权限 --> 创建动态路由
            */
            console.log("---->>>>>",store.getters["role/addRouter"].length)
            if(store.getters["role/addRouter"].length==0){
                console.log("测试")
                store.dispatch("role/getRoles").then(res=>{//提交actions
                    //获取权限
                    const roles=res
                    //根据权限结合路由  创建动态路由
                    store.dispatch("role/createRole",roles).then(res=>{
                        //获取经过过滤的该用户的路由对象
                        const addRouter=store.getters["role/addRouter"]
                        const allRouter=store.getters["role/allRouter"]
                    
                        router.options.routes=allRouter
                        //添加到全局的路由对象
                        router.addRoutes(addRouter)
                        // console.log("@@@",addRouter)
                        next({...to})
                    })
                })
            }else{
                next()
            }
            
       
           
        }
      
      
    }else{
        if(writerRouter.indexOf(to.path)!==-1){
            next() //如果访问的是登录此时应该执行next()
        }else{
            next("/login")  //不存在  未登录  跳转到登录页面执行登录
        }
    }
})


