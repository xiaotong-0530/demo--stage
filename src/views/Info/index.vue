<template>
  <div class="info">
      <!-- 顶部 -->
      <div class="space-20"></div>
      <el-row :gutter="10">

        <el-col :span="4">
          <div class="label_warp category" style="width:100%">
            <label for="category">分类：</label>
            <div class="warp_content">
              <el-select id="category"  v-model="info_select" slot="prepend" placeholder="请选择" class="info_select">
                <el-option v-for="cate in category.item" :key="cate.id" :label="cate.category_name" :value="cate.id"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        
        <el-col :span="7">
          <div class="label_warp date" >
              <label for="date">日期：</label>
              <div class="warp_content">
                <el-date-picker
                    style="width:'100%'"
                    v-model="info_date"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['12:00:00']">
                </el-date-picker>
              </div>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="label_warp keyword" >
            <label for="keyword">关键字：</label>
            <div class="warp_content">
              <Selectone :option="data.option" :selectValue.sync="data.selectValue"/>
            </div>
          </div>
        </el-col>
        
        <el-col :span="3">
          <el-input v-model="info_input" placeholder="请输入内容" class="info_input info_data2"  ></el-input>
        </el-col>

        <el-col :span="2">
            <el-button type="danger" @click="getNews" style="width:100%">搜索</el-button>
        </el-col>

        <el-col :span="4">
          <!-- <el-button type="danger" @click="kunran" style="width:50%" >重置</el-button> -->
          <el-button type="danger" @click="info_dailog = true" style="width:50%" class="pull_right">新增</el-button>
        </el-col>

      </el-row>
      
      <!-- 中间 -->
      <div class="space-20"></div>
      <el-row>
        <el-table :data="table_data.item" border style="width: 100%" ref="table" @selection-change="selected">
          <el-table-column  type="selection" ></el-table-column>
          <el-table-column prop="title"  label="标题"  min-width="5"> </el-table-column>
          <el-table-column prop="categoryId" label="类别" :formatter="_cate" min-width="1"> </el-table-column>
          <el-table-column prop="createDate" label="日期" :formatter="_date" min-width="2"> </el-table-column>
          <el-table-column prop="id" label="姓名"  min-width="1"> </el-table-column>
          <el-table-column   label="操作"  min-width="3"> 
            <template slot-scope="scope">
              <el-button   size="mini"  type="danger" @click="deletelast(scope.row.id)">删除</el-button>
              <el-button size="mini" @click="editItem(scope.row.id)"  type="success">编辑</el-button>
              <el-button size="mini" @click="detailItem(scope.row)"  type="success">编辑详情</el-button>
            </template> 
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 底部 -->
      <div class="space-20"></div>
      <el-row>
        <el-button class="pull_left" @click="deleteAll"  >批量删除</el-button>
        <el-pagination
            class="pull_right"
            background 
            :current-page="current_page"
            @current-change="current_change"
            :page-sizes="[5,10,15]"
            @size-change="size_change"
            layout="sizes,total,prev, pager, next" 
            :total="total">
        </el-pagination>
      </el-row>

      <!-- 新增弹框 -->
     <InfoDialog :info_dailog.sync='info_dailog' :category="category.item" @loadNews="getNews"/>
     <!-- 编辑弹框 -->
     <EditDialog :info_dailog_edit.sync='info_dailog_edit' :category="category.item" :id="editId" @reload="getNews" />
  </div>
</template>

<script>
import {onMounted, reactive,ref,handleEdit,handleDelete,watch} from "@vue/composition-api";
import InfoDialog from "./dialog/info";//新增
import EditDialog from "./dialog/edit";//编辑
import {common} from "../../api/common"
import {global} from "../../utils/global_3.0";//删除封装
import {get_news,delete_news} from "../../api/info"
import {formatDate} from "../../utils/function"
import { Input } from 'element-ui';
import Selectone from "../../components/select/index" //下拉

export default {
  components:{InfoDialog,EditDialog,global,Selectone},

  setup(prop,{refs,root}){
    ///////////////////////////// 公共业务 ///////////////////////////////////////
    const category=reactive({
      item:[]
    })
    
    const {comfirm}= global()
    const {category:_category,getCategoryAll}= common()
    watch(()=>_category.item,(value)=>{
      category.item=value 
    })
    ///////////////////////////// methods ////////////////////////////////////////

    onMounted(()=>{
      //1.vuex 获取     2. 3.0特性公共业务抽离
      getCategoryAll()
      //2.获取列表信息
      getNews()
    })

    ///////////////////////////// ref ////////////////////////////////////////
    //初始化下拉框的选项
    const data=reactive({
      option:{init:["id","title"]},//init初始化的内容
      //选中的select
      selectValue:{},
    })
      
    //类型的默认数据
    const info_select=ref("")
    //日期的默认数据
    const info_date=ref("")
    //关键字的默认数据
    const info_keyword=ref("id")
    //搜索下拉框的默认数据
    const info_value=reactive([
      {value: 'id', label: 'ID' }, 
      {value: 'title', label: '标题' }
    ])
    //input框的默认数据
    const info_input=ref("")
    //表格的默认数据
    const table_data=reactive({
        item:[]
    })
    //新增弹框
    const info_dailog=ref(false)
    //编辑弹框
    const info_dailog_edit=ref(false)
    // 弹框类型
    const info_select2=ref("")
    //弹框文本框
    const info_textarea=ref("")
    //选中的数据行
    let selected_date=reactive([])
    const editId=ref("")
    //页码和实际数据的值一样
    const total=ref(0)
    ///////////////////////////// methods ////////////////////////////////////////
    const detailItem=((row)=>{
      //让对应详情在nav中显示
      root.$router.options.routes[2].children[2].hidden=false
      //跳转
      //需要传递的参数保存到vuex  -->本地
      const params={
        id:{
          value:row.id,
          key:"id",
          session:true//保存到session
        }
      }
      

      root.$store.commit("params/CACHE_PARAMS",params)

      root.$router.push({
          name:"infoDetail",
          params:{
            id:row.id,
          }
      })
    })
   
   
   
   
   const kunran=((data)=>{
      // table_data.item=[]
      // info_select=[]
    })
    //编辑的单个操作
    const editItem=((id)=>{
      info_dailog_edit.value=true
      editId.value=id
    })
    //格式化日期
    const _date=((row)=>{
      return formatDate(row.createDate)
    })
    //格式化分类
    const _cate=((row)=>{

      let id=row.categoryId
      let cate_name=""
      let map=category.item.filter(cate=>{//过滤
        if(cate.id==id){
          cate_name=cate.category_name
        }
      })

       return cate_name
    })
    const current_page=ref(1)
    const page=reactive({
        pageNumber:1, //页码
        pageSize:10   //页大小
    })
    //点击页码
    const current_change=((currentPage)=>{
      page.pageNumber=currentPage
      getNews()
    })
    //点击页大小
    const size_change=((pageSize)=>{
       page.pageSize=pageSize
       getNews()
    })
    //点击选择搜索的类型
    const search_keyword=((value)=>{
      // console.log(1111)
      info_keyword.value=value
      // console.log("-->",info_keyword.value)
      
    })
    //
    const serach=(()=>{
      let data={
        pageNumber:page.pageNumber, //页码
        pageSize:page.pageSize      //页大小
      }
      //处理类别
      if(info_select.value){
        data.categoryId=info_select.value
      }
      //日期
      if(Array.isArray(info_date.value) && info_date.value.length>0){
        data.startTime=info_date.value[0]
        data.endTime=info_date.value[1]
      }
      //关键字
      if(info_input.value){
        data[info_keyword.value]=info_input.value
        // data.id=info_keyword.value
      }
      return data
    })
    //获取列表数据
    const getNews=(()=>{
      let data=serach()
      get_news(data).then((res)=>{
          table_data.item=res.data.data.data
          total.value=res.data.data.total
          // total.value=res.data.data.data.length
          //重新刷新的目的就是为了请求上一页数据
          if(res.data.data.data.length==0 && page.pageNumber!==1){
            window.location.reload()
          }
      }) 
    })
    //vue注入的全局方法  通过vue实例 调用
    const delete_item=(ids)=>{
      
      delete_news({
        id:ids
      }).then(res=>{
        getNews()
      })
    }
    //单个删除
    const deletelast=((id)=>{
      
      selected_date=reactive([Number(id)])
      comfirm({
        content:"此操作将永久删除该文件, 是否继续?",
        tip:"提示",
        type: 'info',
        center: true,
        callback:delete_item,
        id:selected_date
      })
    }) 
    // selection-change	当选择项发生变化时会触发该事件3
    const selected=(rows)=>{
        selected_date=reactive([])
        rows.map(item=>{
          selected_date.push(item.id)
        })
    }
    //批量删除
    const deleteAll=(()=>{
        const {comfirm}= global()
        
        if(selected_date.length==0){
          root.$message({
            type:"error",
            message:"请选中数据",
            duration:1000
          })
          return false
        }else{
          
        }

        comfirm({
        content:"此操作将永久删除该文件, 是否继续?",
        tip:"提示",
        type: 'success',
        center: true,
        callback:delete_item,
        id:selected_date
      })
    })
    
    
    return{
      //ref
      category,info_select,info_date,info_keyword,info_value,info_input,table_data,info_dailog,
      info_dailog_edit,info_select2,info_textarea,selected_date,total,current_page,editId,data,
      //methods
      search_keyword,deletelast,deleteAll,selected, _date,_cate,getNews,current_change,size_change,
      kunran,editItem,detailItem
    }
      
  }
};
</script>

<style lang="scss" scoped>
  .label_warp{
    &.category{
      @include labelDom(40,center,60,14)
    }
    &.date{
      @include labelDom(40,center,60,14)
    }
    &.keyword{
      @include labelDom(40,center,60,14)
    }
  }
  

</style>