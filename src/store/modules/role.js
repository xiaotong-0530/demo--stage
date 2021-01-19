import {get_roles} from "@/api/login.js"
import {roleRouter,defaultRoutes} from "../../router/index"

const state={
    addRouter:[],//过滤后根据权限后的路由信息
    allRouter:defaultRoutes,//所有的路由
    premButton:[]
}
const getters={ 
    addRouter:state=>state.addRouter, 
    allRouter:state=>state.allRouter,
    premButton:state=>state.premButton
}
const mutations={
   SET_ROUTER(state,data){
       state.addRouter=data
       state.allRouter=[...state.allRouter,...data]
   },
   SET_PREMBUTTON(state,data){
       state.premButton=data
   }
}

//检测是否有权限
const checkRouter=(router,roles)=>{
    return roles.some(role=>{
        return router.meta.role.indexOf(role) >=0
    })
}

//操作具体的按钮权限
const changeButton=(arr,flag_arr=['info','user'])=>{
    let _arr=[]
    arr.map(item=>{
        flag_arr.map(flag=>{
            if(item.split('.')[0]==flag){
                if(!_arr.includes(`${flag}.index`)){
                    _arr.push(`${flag}.index`)
                }
            }
        })
        
        _arr.push(item)
    })
    return _arr
}
const actions={
    //获取用户的角色
    getRoles({commit}){
        return new Promise((resolve,reject)=>{
            //ajax
            get_roles({}).then(res=>{
                /*
                {
                    btnPerm: []
                    button: (2) ["info.edit", "info.delete"]
                    role: ["admin"] //admin  管理员   salesman 业务员 technician 技术员   manager 经理

                }
                */
                resolve({
                    btnPerm: [],
                    button: ["info.edit", "info.delete","user.delete","info.cate","user.add"],
                    role: ["salesman"] 
                })
            })
        })
    },
    //根据权限信息 过滤对应的路由
    createRole({commit},roles){
        return new Promise((resolve,reject)=>{
            //roles , roleRouter
            //业务 : 筛选 根据roles 的权限 结合 动态路由 ==> 可以访问的路由
            //roleRouter
            roles.button=changeButton(roles.button)

            commit("SET_PREMBUTTON",roles.button)


            let tmpRouters=[]
            //业务: 筛选 根据roles 的权限 结合 动态路由 ==> 可访问的路由
            if(roles.role.includes("admin")){
                tmpRouters=roleRouter//管理员全部
            }
            else{
                tmpRouters=roleRouter.filter(item =>{//过滤  
                    if(checkRouter(item,roles.role)){
                      if(item.children && item.children.length>0){
                          item.children=item.children.filter(item_=>{
                            if(checkRouter(item_,roles.button)){
                              return item_
                            }
                          }) 
                      }
                      return item
                       
                    }          
                })
            } 
            commit("SET_ROUTER",tmpRouters) 
            resolve()
        })
    }
}



export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions,
    
};