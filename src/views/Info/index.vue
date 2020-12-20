<template>
  <div class="info">
      <!-- 顶部 -->
      <div class="space-20"></div>
      <el-row :gutter="10">

        <el-col :span="4">
          <div class="label_warp category" style="width:100%">
            <label for="category">类型：</label>
            <div class="warp_content">
              <el-select id="category"  v-model="info_select" slot="prepend" placeholder="请选择" class="info_select">
                <el-option label="社会型" value="1"></el-option>
                <el-option label="企业型" value="2"></el-option>
                <el-option label="常规型" value="3"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        
        <el-col :span="7">
          <div class="label_warp date" >
              <label for="date">日期：</label>
              <div class="warp_content">
                <el-date-picker id="date" style="width:100%" v-model="info_date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
              </div>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="label_warp keyword" >
            <label for="keyword">关键字：</label>
            <div class="warp_content">
              <el-select @click="search_keyword" id="keyword"  v-model="info_keyword" slot="prepend" placeholder="ID" class="info_select" style="width:100%">
                <el-option  v-for="item in info_value" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        
        <el-col :span="3">
          <el-input v-model="info_input" placeholder="请输入内容" class="info_input info_data2"  ></el-input>
        </el-col>

        <el-col :span="2">
            <el-button type="danger"  style="width:100%">搜索</el-button>
        </el-col>

        <el-col :span="4">
          <el-button type="danger" @click="info_dailog = true" style="width:50%" class="pull_right">新增</el-button>
        </el-col>

      </el-row>
      
      <!-- 中间 -->
      <div class="space-20"></div>
      <el-row>
        <el-table :data="table_data" border style="width: 100%" ref="table" @selection-change="selected">
          <el-table-column  type="selection" ></el-table-column>
          <el-table-column prop="title"  label="标题"  min-width="6"> </el-table-column>
          <el-table-column prop="category" label="类别"  min-width="1"> </el-table-column>
          <el-table-column prop="date"  label="日期" min-width="2"> </el-table-column>
          <el-table-column prop="name" label="姓名"  min-width="1"> </el-table-column>
          <el-table-column   label="操作"  min-width="2"> 
            <template slot-scope="scope">
              <el-button   size="mini"  type="danger" @click="deletelast(scope.row.id)">删除</el-button>
              <el-button size="mini" @click="info_dailog_edit=true"  type="success">编辑</el-button>
            </template> 
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 底部 -->
      <div class="space-20"></div>
      <el-row>
        <el-button class="pull_left" @click="deleteAll"  >批量删除</el-button>
        <el-pagination background  layout="prev, pager, next" :total="1000"  class="pull_right"> </el-pagination>
      </el-row>

      <!-- 新增弹框 -->
     <InfoDialog :info_dailog.sync='info_dailog'/>
     <!-- 编辑弹框 -->
     <EditDialog :info_dailog_edit.sync='info_dailog_edit'/>
  </div>
</template>

<script>
import {onMounted, reactive,ref,handleEdit,handleDelete,watch} from "@vue/composition-api";
import InfoDialog from "./dialog/info";
import EditDialog from "./dialog/edit";
// import {comfirm}  from "../../utils/delete";
import global from "../../utils/global_3.0";

export default {
  components:{InfoDialog,EditDialog,global},

  setup(prop,{refs,root}){
    ///////////////////////////// ref ////////////////////////////////////////
    //类型的默认数据
    const info_select=ref("")
    //日期的默认数据
    const info_date=ref("")
    //关键字的默认数据
    const info_keyword=ref("")
    //搜索下拉框的默认数据
    const info_value=reactive([
      {value: 'id', label: 'ID' }, 
      {value: 'png', label: 'PNG' }
    ])
    //input框的默认数据
    const info_input=ref("")
    //表格的默认数据
    const table_data=reactive( [{
      id:1,
      title:'纽约市长白思豪宣布退出总统竞选 特朗普发推回应',
      date: '2016-05-02',
      name: '管理员',
      address: '上海市普陀区金沙江路 1518 弄',
      category:"国内信息"
    }, {
        id:2,
      title:'习近平在中央政协工作会议暨庆祝中国人民政治协商会议成立70周年大会上发表重要讲话',
      date: '2016-05-04',
      name: '新华',
      address: '上海市普陀区金沙江路 1517 弄',
        category:"国内信息",
    }, {
        id:3,
      title:'基里巴斯与台当局"断交"系蔡当局上台后断交第7国',
      date: '2016-05-01',
      name: '思华',
      address: '上海市普陀区金沙江路 1519 弄',
        category:"国内信息"
    }, {  
      id:4,
      title:'不选了! 纽约市长白思豪宣布退出2020美国大选',
      date: '2016-05-03',
      name: '小童',
      address: '上海市普陀区金沙江路 1516 弄',
      category:"国内信息"
    }])
    //新增弹框
    const info_dailog=ref(false)
    //编辑弹框
    const info_dailog_edit=ref(false)
    // 弹框类型
    const info_select2=ref("")
    //弹框文本框
    const info_textarea=ref("")
    //选中的数据行
    let selected_date=null
    
    ///////////////////////////// methods ////////////////////////////////////////
    //vue注入的全局方法  通过vue实例 调用
    const delete_item=(id)=>{
      // console.log("我是删除")
      console.log(id)
    }
    //单个删除
    const deletelast=((id)=>{
      const {comfirm}= global()
      selected_date=reactive([id])
      comfirm({
        content:"此操作将永久删除该文件, 是否继续?",
        tip:"提示",
        type: 'info',
        center: true,
        callback:delete_item,
        id:selected_date
      })
    }) 

    const selected=(rows)=>{
        selected_date=reactive([])
        rows.map(item=>{
          selected_date.push(item.id)
        })
    }
    //批量删除
    const deleteAll=(()=>{
      console.log(selected_date)
       const {comfirm}= global()
        comfirm({
        content:"此操作将永久删除该文件, 是否继续?",
        tip:"提示",
        type: 'success',
        center: true,
        callback:delete_item,
        id:selected_date
      })
    })
    const search_keyword=(()=>{

    })
    
    return{
      //ref
      info_select,
      info_date,
      info_keyword,
      info_value,
      info_input,
      table_data,
      info_dailog,
      info_dailog_edit,
      info_select2,
      info_textarea,
      selected_date,
      //methods
      search_keyword,
      deletelast,
      deleteAll,
      selected
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