import {reactive} from "@vue/composition-api";
 
//表格加载的数据业务
export const page=()=> {
    //分类信息
    const pageData = reactive({
        total:0,
        page_sizes:[5,10,15],
        current_page:1,
        page_size:5
    })
    
    const setTotal=((total)=>{
        pageData.total=total
    })
    //点击页码
    const current_change=((pageNumber)=>{
        pageData.current_page=pageNumber
    })
    //点击页大小
    const size_change=((pageSize)=>{
        pageData.page_size=pageSize
    })

    return {
        pageData,setTotal,current_change,size_change
    }

}
