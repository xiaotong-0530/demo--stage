import axios from "@/utils/request.js"
// import { use } from "vue/types/umd"

//获取用户
export const get_users =(data) =>{
    return axios.request({
        method: 'post',
        url: '/user/getList/',
        data: data
        
    })
}

//添加
export const add_users =(data) =>{
    return axios.request({
        method: 'post',
        url: '/user/add/',
        data: data
        
    })
}

/*
    修改用户
*/ 

export const edit_user=(data)=>{  //post:data  get:parmas
    return axios.request( {
        method:"post",
        url:'/user/edit/ ',
        data:data
    })
}

//删除用户
export const del_use =(data) =>{
    return axios.request({
        method: 'post',
        url: '/user/delete/',
        data: data
        
    })
}


//用户状态更改
export const change_status_user =(data) =>{
    return axios.request({
        method: 'post',
        url: '/user/actives/',
        data: data
        
    })
}

//角色
export const get_role =(data) =>{
    return axios.request({
        method: 'post',
        url: '/role/',
        data: data
        
    })
}

// 权限
export const get_permission =(data) =>{
    return axios.request({
        method: 'post',
        url: '/permButton/',
        data: data
        
    })
}