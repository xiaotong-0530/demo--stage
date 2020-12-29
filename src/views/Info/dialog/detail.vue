<template>
  <div>
    <div class="space-20"></div>
    <el-form ref="form"  label-width="80px">

      <el-form-item label="信息分类 :">
        <el-select v-model="form.categoryId" placeholder="请选择活动区域">
          <el-option  v-for="cate in category.item"  :key="cate.id" :label="cate.category_name" :value="cate.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动名称 : "  style="width:400px">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="缩略图 : "  style="width:400px">
        缩略图
      </el-form-item>

      <el-form-item label="发布日期 : "  >
        <div class="block">
            <el-date-picker
              v-model="form.createDate"
              type="date"
              format="yyyy-MM-dd / HH:mm:ss"
              placeholder="选择日期" disabled>
            </el-date-picker>
        </div>
      </el-form-item>
      
      <el-form-item label="富文本 : "   >
          <quill-editor   v-model="form.content" ref="myQuillEditor" style="height:200px"></quill-editor>
      </el-form-item>

      <el-form-item   >
            <el-button type="success" @click="submit">提交</el-button>
      </el-form-item>
    </el-form >
  </div>
</template>

<script>
import { onActivated, onDeactivated,onMounted,reactive,ref,watch } from '@vue/composition-api';
import {get_news,edit_news} from "@/api/info"
import {common} from "@/api/common"
import {formatDate} from "@/utils/function"
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components:{quillEditor},
 
  setup(props,{root,refs}){

    const id=ref("")
    const form=reactive({
      categoryId:"",
      title:"",
      createDate:"",
      content:""
    })
    const {category:cate,getCategoryAll}=common()
    const category=reactive({
      item:[]
    })

    const submit=(()=>{

      const data={
        id:id.value,
        categoryId:form.categoryId,
        title:form.title,
        content:form.content
      }
      edit_news(data).then(res=>{
        root.$message({
          type:"success",
          message:"提交成功"
        })
        window.location.reload()//刷新
      })

    })

    //setup 对于keepalive缓存的时候只能执行一次  后面正在进入这个组件跳过setup
    console.log("steup......")

    const getInfo=(()=>{
      get_news({
          pageNumber:1,
          pageSize:1,
          id:id.value
      }).then(res=>{
          const responseData=res.data.data.data[0]
          form.categoryId=responseData.categoryId
          form.title=responseData.title
          form.createDate=formatDate(responseData.createDate)
          form.content=responseData.content
      })
    })
    onMounted(()=>{
      getCategoryAll()//分类信息
    })
    
    watch(()=>cate.item,(value)=>{
      category.item=value
    })

    onActivated(()=>{
      id.value=root.$route.params.id || root.$store.getters["params/id"]
      getInfo()
      console.log("activated 进入")
    })
    onDeactivated(()=>{
      console.log("deactivated 离开")
    })


    return{
       id,form,category,submit
    }
      
  }
};
</script>

<style lang="scss" scoped>
    
</style>