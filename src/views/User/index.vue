<template>
  <div >
    <!-- 顶部 -->
      <div class="space-20"></div>
      <el-row :gutter="10">
        <el-col :span="4">
          <div class="label_warp keyword" >
            <label >关键字:</label>
            <div class="warp_content">
              <Selectone :option="data.option" :selectValue.sync="data.selectValue"/>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <el-input v-model="data.keyword" placeholder="请输入内容" class="info_input info_data2"  ></el-input>
        </el-col>
        <el-col :span="2">
            <el-button type="danger"  style="width:100%" @click="search">搜索</el-button>
        </el-col>
        <el-col :span="15">
          <el-button type="danger" v-if="data.add_flag" @click="add" style="width:12%" class="pull_right">新增</el-button>
        </el-col>
      </el-row >

       <!-- 中间 -->
      <div class="space-20"></div>
      <el-row>
        <Tableone ref="table" :tableConfig="data.tableConfig" :tableSelect.sync="data.tableSelect">
          <template v-slot:status="scopeDate">
                <el-switch @change="statusChange(scopeDate.data)" v-model="scopeDate.data.status" inactive-value="1" active-value="2" active-color="#13ce66" inactive-color="#ff4949"></el-switch>  
          </template>
          <template v-slot:updata="scopeDate" >
            <el-button size="small" type="success" v-if="data.delete_flag" @click="del_one(scopeDate.data)">删除</el-button>
            <el-button size="small" type="danger"  @click="edit(scopeDate.data)">编辑</el-button>
          </template>

          <template v-slot:footer >
               <el-button type="info" @click="del_more">批量删除</el-button>
          </template> 
        </Tableone>
      </el-row>

      <!-- 新增弹框 -->
      <userDialog :showDialog.sync="data.showDialog" :dialogData="data.dialogData"/>
  </div>
</template>

<script>
import { onMounted, reactive,ref} from '@vue/composition-api';
import {get_news,add_users} from "@/api/info"
import userDialog from "./dialog/user_dialog";//新增
import Selectone from "../../components/select/index"//下拉
import Tableone from "../../components/Table/index"
import {global} from "../../utils/global_3.0"
import {del_use,change_status_user} from "../../api/user.js"
import lodash from "lodash"
import store from "../../store/index"
import role from '../../store/modules/role';

export default {
  components:{userDialog,Selectone,Tableone},

  setup(props,{refs,root}){
    //用户页面 检查add edit delete是否有权限
    onMounted(()=>{
      const button_ = store.getters['role/premButton']
      button_.map(item=>{
        let role_arr=item.split(".")
        if(role_arr[0]=='user'){
          if(role_arr[1]=='delete'){
            data.delete_flag=true
          }else if(role_arr[1]=='edit'){
            data.edit_flag=true
          }else if(role_arr[1]=='add'){
            data.add_flag=true
          }
        }
      })
    }) 



    const data=reactive({
      delete_flag:false,
      edit_flag:false,
      add_flag:false,
      //初始化下拉框的选项
      option:{init:["id","title"]},//init初始化的内容
      //关键字
      keyword:"",
      //开关
      status:"",
      //选中的select
      selectValue:{},
      //表格配置
      tableConfig:{
        tHead:[
            {
                prop:"username",
                label:"邮箱/用户名",
                width:""
            },
            {
                prop:"truename",
                label:"真实姓名",
                width:"" 
            },
            {
                prop:"phone",
                label:"手机号",
                width:"" 
            },
            {
                prop:"region",
                label:"地区",
                width:"" 
            },
            {
                prop:"role",
                label:"角色",
                width:"" 
            },
            {
                prop:"",
                label:"禁启用状态",
                type:"slot",
                slotName:"status"
            },
            {
                prop:"",
                label:"操作",
                type:"slot",
                slotName:"updata"
            },

        ],
        //是否显示多选框
        showSelect:true,
        //表格接口请求参数
        requestData:{
          url:'/user/getList/',
          method:'post',
          data:{
            pageNumber:1,
            pageSize:5,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          }
        }, 
        //分页样式
        pageLayout:"total,sizes,prev, pager, next",
      },
      //表格选中数据
      tableSelect:[],
      showDialog:false,
      dialogData:{}
     
    })
    

    const {comfirm} = global()

    //删除单个
    const del_one=(({id})=>{
      data.tableSelect=[id]
      checkdel()
    })

    const do_del=(()=>{
      del_use({
        id:data.tableSelect
      }).then(res=>{
        //让表格重新刷新
        refs["table"].refresh()
      })
    })

    const checkdel=(()=>{
      //删除数据是否勾选
      if(data.tableSelect==0){
        root.$message({ 
           type: 'error',
           message: "请勾选用户数据",
           duration:1000
        })
        return false
      }
      comfirm({ 
         content: '确认删除吗?',
         tip: "删除用户",
         type:"danger",
         center:"center",
         callback:do_del
     })
    })
    
    //批量删除
    const del_more=(()=>{
       checkdel()
    })

    //编辑业务
    const search=(()=>{
      refs["table"].refreshWithParams({
        [data.selectValue.value]:data.keyword
      })
    })

    //更改用户禁用和启用
    const statusChange=lodash.throttle((row)=>{
      change_status_user({
        id:row.id,
        status:row.status
      }).then(res=>{
       
      })
    },3000)

    const add=(()=>{
        data.showDialog=!data.showDialog
        data.dialogData={}
    })
    const edit=((params)=>{
        data.showDialog=!data.showDialog
        data.dialogData=params
    })
    return{
      /////////  ref ///////////
      ////////// reactive   ////////
      data,del_one,del_more,search,statusChange,add,edit
    }
      
  }
};
</script>

<style lang="scss" scoped>
    .label_warp{
      &.keyword{
        @include labelDom(40,center,60,14)
      }
  }
</style>