import axios from "@/utils/request.js"
/*
    添加一级分类
*/
export const add_first_category=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/addFirstCategory/',
        data: data
        
    })
}
/*
    获取所有分类
*/
export const get_all_category=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/getCategoryAll/',
        data: data
        
    })
}
/*
   添加子级分类
*/
export const add_second_category=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/addChildrenCategory/',
        data: data
        
    })
}
/*
  删除一级和二级分类
*/
export const delete_first_category=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/deleteCategory/',
        data: data
        
    })
}

/*
  编辑一级和二级分类
*/
export const edit_category=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/editCategory/',
        data: data
    })
}

/*
  添加信息
*/
export const add_news=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/add/',
        data: data
    })
}

/*
  获取表单信息
*/
export const get_news=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/getList/',
        data: data
    })
}

/*
  删除信息
*/
export const delete_news=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/deleteInfo/',
        data: data
    })
}

/*
  修改信息
*/
export const edit_news=(data)=>{
    return axios.request({
        method: 'post',
        url: '/news/editInfo/',
        data: data
    })
}