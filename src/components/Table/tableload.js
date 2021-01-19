import {reactive} from "@vue/composition-api";
import {loadTableDate} from "@/api/common.js"
 
//表格加载的数据业务
export const loadData=()=> {
    //分类信息
    const tableData = reactive({
        item: [],   //数据
        total:0   //数据条数
      
    })
    const tableLoadData=((requestData)=>{
        //发送数据 
        loadTableDate(requestData).then(res=>{
            tableData.item=res.data.data.data,
            tableData.total=res.data.data.total
        })
    })
    return {
        tableData,
        tableLoadData
    }

}

