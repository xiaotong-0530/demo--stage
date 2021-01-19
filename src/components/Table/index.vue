<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%" ref="table" @select="select" @select-all="select" >
        <!-- 多选框 -->
        <el-table-column type="selection"  width="55" v-if="data.tableConfig.showSelect"></el-table-column>
        <!-- 表头 -->
        <template v-for="item in data.tableConfig.tHead">
            <!-- 表头  文本渲染 -->
            <el-table-column v-if="item.type!='slot' "  :key="item.name" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
            <!-- 表头  插槽渲染 -->
            <el-table-column v-else  :key="item.name" :prop="item.prop" :label="item.label" :width="item.width">
                <template v-slot="scope"> 
                    <slot :name="item.slotName" :data="scope.row" ></slot>
                </template>
                
            </el-table-column>
        </template>

    </el-table>

    <div class="space-20"></div>
    <el-row>
        <el-col :span="4" class="pull-left">
            <slot name="footer"></slot>
        </el-col>
        <el-col :span="20" >
            <el-pagination
                background
                class="pull_right"
                :layout="data.tableConfig.pageLayout"

                :page-size="pageData.page_size"
                :total="pageData.total"
                :page-sizes="pageData.page_sizes"
                :current-page="pageData.current_page"
                @current-change="current_change"
                @size-change="size_change">
            </el-pagination>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { onMounted, reactive,ref,watch} from '@vue/composition-api';
import {loadTableDate} from "../../api/common.js"
import {loadData} from "./tableload.js"
import {page} from "./page.js"

export default {
  props:{
      tableConfig:{
          type:Object,
          default:{},
      },
      tableSelect:{
          type:Array,
          default:[]
      }
  },
  setup(props,{refs,root,emit}){
    const data=reactive({
        tableConfig:{
            tHead:[],
            showSelect:false,
            requestData:{},
            pageLayout:"",
        }, 
        
        tableData:[]
    })

    //表格的初始化状态
    const initTable=()=>{
        // data.tableConfig.tHead=props.tableConfig.tHead
        // data.tableConfig.showSelect=props.tableConfig.showSelect 

        const tableConfigKeys=Object.keys(data.tableConfig)
        //传什么配置  替换什么配置
        for(let key in props.tableConfig){
            //判断传递的属性是否属于配置属性   -->key
            if(tableConfigKeys.includes(key)){
                data.tableConfig[key]=props.tableConfig[key]
            }else{
                root.$message({
                    type:"error",
                    message:`${key}属性为未定义`
                })
            }
        }
    }
    //表格业务
    const {tableData,tableLoadData} =loadData()
    
    //监听表格数据
    watch([
        ()=>tableData.item,
        ()=>tableData.total
    ],([newData,newTotal])=>{
        data.tableData=newData
        setTotal(newTotal)

    })
    //分页业务
    const {pageData,setTotal,current_change,size_change} =page()
   
    watch([
        ()=>pageData.current_page,
        ()=>pageData.page_size,
        
    ],([currentPage,pageSize])=>{
       //发送请求
       const params=data.tableConfig.requestData
       params.data.pageNumber=currentPage
       params.data.pageSize=pageSize
       tableLoadData(params)
    })

    // 点击select框时触发的事件
    const select=((value)=>{ 
         const ids=[]
         value.map(item=>ids.push(item.id))
         emit("update:tableSelect",ids)
    })

    //刷新表格数据
    const refresh=(()=>{
        tableLoadData(data.tableConfig.requestData)
    })

    //带参数请求数据
    const refreshWithParams=(params)=>{
        const requestData=Object.assign(params,{
            pageNumber:1,
            pageSize:5,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        })//合并
        data.tableConfig.requestData.data=requestData
        tableLoadData(data.tableConfig.requestData)//刷新
    }
    
    onMounted(()=>{
        initTable()
        tableLoadData(data.tableConfig.requestData)
    })

    return{
       data,initTable,loadData,
       current_change,size_change,pageData,select,refresh,refreshWithParams
    }
  }
 
};
</script>

<style scoped lang="scss">

</style>

//添加内容
// const data={
//             username:"8787312@oo.com ",
//             truename:"3932",
//             password:"123ff456tg",
//             phone:"162356f54496",
//             region:{},
//             status:"1",
//             role:"info,user",
//             btnPerm:""
//         }
//         add_users(data).then(res=>{
//             console.log(res)
//         })


// {
//                 id:1,
//                 username:"2844893235@qq.com ",
//                 truename:"张三",
//                 phone:"15234905837",
//                 region:"山西省朔州市",
//                 role:"项目部",
//             },