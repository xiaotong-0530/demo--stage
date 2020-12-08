import axios from "@/utils/request.js"

//获取验证码
export const get_code =(data) =>{
    // console.log(process.env.NODE_ENV)
    return axios.request({
        method: 'post',
        url: '/getSms/',
        data: data
        
    })
}

//登录
export const do_login =(data) =>{
    return axios.request({
        method: 'post',
        url: '/login/',
        data: data
        
    })
}

//注册
export const do_register =(data) =>{
    return axios.request({
        method: 'post',
        url: '/register/',
        data: data
        
    })
}