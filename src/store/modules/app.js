import {do_login} from "../../api/login"
import {setToken,setUsername,getUsername,getToken,removeUsername,removeToken} from "../../utils/cookie"

const state={
   // getItem  查找
   //  isCollapse:sessionStorage不存在走false 存在了就执行
   isCollapse:JSON.parse(sessionStorage.getItem("isCollapse")) || false,//展开
   token:getToken() ||'',
   username:getUsername() || ""
}
const getters={ //推荐在getters里面写
   isCollapse:()=>state.isCollapse 
}
const mutations={
   SET_COLLAPSE(state){
        state.isCollapse=!state.isCollapse
        //将此时的状态存入
        // JSON.stringify()  转化为字符串
        // setItem 存储
        sessionStorage.setItem("isCollapse",JSON.stringify(state.isCollapse))
   },

   //设置用户
   SET_USERNAME(state,value){
      state.username=value
   },
   //设置token
   SET_TOKEN(state,value){
      state.token=value 
   }
   
}
const actions={
   //登录action--> 
   login({commit},data){
      // 发起网络请求
      return new Promise((resolve,reject)=>{
         do_login(data).then(res=>{
           
            const {username,token} =res.data.data
            //通过同步的方式将数据更新到state
            commit("SET_USERNAME",username)
            commit("SET_TOKEN",token)
            resolve(res)
            //以cookie的方式存放到浏览器
            setToken(token)
            setUsername(username)
         }).catch(err=>{

         })
      })
   },
   //退出
   exit({commit}){
      return new Promise((resolve,reject)=>{ 
         removeUsername()
         removeToken()
         commit("SET_USERNAME","")
         commit("SET_TOKEN","")
        
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
  