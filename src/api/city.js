import axios from "@/utils/request.js"
/*
    添加一级分类
*/
export const get_city=(data)=>{
    return axios.request({
        method: 'post',
        url: '/cityPicker/',
        data: data
        
    })
}