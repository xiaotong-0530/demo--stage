import {reactive} from "@vue/composition-api";
import {get_all_category} from "../api/info"
import axios from "@/utils/request.js"

export const common=()=> {
    //分类信息
    const category = reactive({
        item: []
      
    })
    const getCategoryAll=(()=>{
        //发送数据
        get_all_category({}).then(res=>{
            // console.log("common",res.data.data)
            category.item=res.data.data
        })
    })
    return {
        category,
        getCategoryAll
    }

}


//表格请求
export const loadTableDate =(params) =>{
    return axios.request({
        method: params.method,
        url:params.url,
        data: params.data
        
    })
}