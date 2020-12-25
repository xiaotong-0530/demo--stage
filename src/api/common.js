import {reactive} from "@vue/composition-api";
import {get_all_category} from "../api/info"

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