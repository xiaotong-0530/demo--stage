<template>
  <div id="category">
    <el-button type="danger" class="el-button--danger__aa" @click="addFirstCate">添加一级分类</el-button>
    <hr />

    <div class="space-20"></div>
    <div>
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="category-wrap">
            <div class="category" v-for="(cate) in category.item" :key="cate.id">
              <!--一级分类-->
              <h4>
                <svg-icon iconName="add"></svg-icon>
                {{cate.category_name}}
               
                <div class="button-group">
                  <el-button size="mini" type="danger" round @click="editCategory(cate,'first_cate')">编辑</el-button>
                  <el-button size="mini" type="success" round @click="addSecondCategory(cate)">添加子级</el-button >
                  <el-button size="mini" round @click="deleteCategory(cate,'first_cate')">删除</el-button>
                </div>
              </h4>
              <!--子级分类-->
              <ul>
                <li v-for="_cate in cate.children" :key="_cate.id">
                  {{_cate.category_name}}
                  <div class="button-group">
                    <el-button size="mini" type="danger" round @click="editCategory(_cate,'second_cate',cate.category_name)">编辑</el-button>
                    <el-button size="mini" round @click="deleteCategory(_cate,'second_cate')">删除</el-button>
                  </div>
                </li>
                
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <h4 class="menu-title">分类编辑</h4>
          <div class="space-20"></div>
          <el-form label-width="142px" class="from-wrap" ref="categoryFrom">
            <el-form-item label="一级分类名称：" prop="categoryName" v-if="category_first_input" >
              <el-input v-model="form.categoryName" :disabled="is_Disabled"></el-input>
            </el-form-item>
            <div class="space-20"></div>
            <el-form-item label="二级分类名称：" prop="secCategoryName"  v-if="category_second_input">
              <el-input v-model="form.secCategoryName"></el-input>
            </el-form-item>
            <div class="space-20"></div>
            <el-form-item>
              <el-button type="danger" style="width:100px" @click="submit">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
import { onMounted, reactive, ref, watch } from '@vue/composition-api'
import { add_first_category ,get_all_category,add_second_category,delete_first_category,edit_category} from "../../api/info"
import {global} from "../../utils/global_3.0"
import {common} from "../../api/common"

export default {
  name: 'category',
  setup(props,{refs,root}) {
    //--------------- ref  ----------------------------
    const category_first_input=ref(true)
    const category_second_input=ref(true)
    const is_Disabled=ref(false) //一级分类的启用和警用
    const submit_type=ref("")
    //--------------- reactive  ----------------------------
    // 分类表单绑定的数据
    const form = reactive({
      categoryName: '', //一级绑定的数据
      secCategoryName: '', //二级绑定的数据
    })
    //存储分类信息
    const category = reactive({
      item: [],
      current: [],
    })

    //--------------- global  ----------------------------
	  const {comfirm} = global()


    //--------------- methods  ----------------------------
    //点击添加一级分类按钮
    const addFirstCate=(()=>{
      category_first_input.value=true
      category_second_input.value=false
      submit_type.value="add_first_category"
	    is_Disabled.value=false
	    form.categoryName=""
    })
    //点击添加二级分类按钮
    const addSecondCategory=((cate)=>{
      form.categoryName=cate.category_name//一级分类input是值等于添加子级按钮的值
      is_Disabled.value=true//一级分类警用
      category_first_input.value=true
      category_second_input.value=true
      submit_type.value="add_second_category"
	    category.current=cate//把当前操作的父类放在current
	    form.secCategoryName=""
	  })
	  //编辑一级 二级分类
    const editCategory=((cate,type,first_cate_name = "")=>{
	  if(type==="first_cate"){//一级
		  is_Disabled.value=false//点击添加子级的时候一级警用
		  form.categoryName=cate.category_name
		  category_second_input.value=false
		  submit_type.value="edit_first_category"
		  category.current=cate
	  }else{//二级
		  form.secCategoryName=cate.category_name
		  form.categoryName=first_cate_name//所对应的一级菜单的值
		  category_first_input.value=true
		  category_second_input.value=true
		  submit_type.value="edit_second_category"
		  category.current=cate
		  is_Disabled.value=true
      }
    }) 
    //删除一级 二级分类
    const deleteCategory=((cate,type)=>{
      //确认以后再删除
      comfirm({
        content:"确认删除吗?",
        tip:"删除",
        type:"success",
        center:true,
        callback:()=>{
          delete_first_category({
            categoryId:cate.id
            }).then(res=>{
            if(type==="first_cate"){
              category.item.map((_cate,index)=>{
              if(_cate.id==cate.id){
                category.item.splice(index,1)
              }
            })
          }else{
            getCategoryAll()
          }
        })
      }
	  }) 

      
    })
    //执行一级分类添加
    const doAddFirstCategory=(()=>{
      if(!form.categoryName){  
        root.$message({
          message: '一级菜单没有填写',
          type: 'warning',
          duration:1000
        })
        return false
      }
      // 获取所有分类
      add_first_category({categoryName:form.categoryName}).then((res)=>{
        root.$message({
          message: res.data.message,
          type: 'success',
        })
        category.item.unshift(res.data.data)//上传到页面
		    getCategoryAll()
      }).catch((err)=>{

      })
     
    })
    //执行二级分类添加
    const doAddSecondCategory=(()=>{
      add_second_category({
          categoryName:form.secCategoryName,
          parentId:category.current.id
      }).then(res=>{
        /*
          1.重新请求数据http 请求
          2.手动找到父类children 数组中push
        */
	      root.$message({
          message: res.data.message,
          type: 'success',
        })
        getCategoryAll()
      }).catch(err=>{

      })
    })
    //执行一级 二级分类编辑
    const doEditCategory=((categoryName)=>{
      edit_category({
        id:category.current.id,
        categoryName:categoryName
      }).then(res=>{

        return category.current.category_name=res.data.data.data.categoryName;
        
        // category.item.map( item => {
        //     if(item.id == category.current.id){
        //       return  item.category_name = res.data.data.data.categoryName
        //     }
        // } )

        // 清空数据
        form.categoryName= '',
        form.secCategoryName= ''
      })
    })
    
    //点击表单提交
    const submit=(()=>{ 
      //判断业务逻辑
      if(submit_type.value==="add_first_category"){
          doAddFirstCategory()//添加一级分类
      }
      if(submit_type.value==="add_second_category"){
          doAddSecondCategory() //添加在分类
      }
      if(submit_type.value === "edit_first_category"){
          doEditCategory(form.categoryName)
      }
      if(submit_type.value === "edit_second_category"){
          doEditCategory(form.secCategoryName)
      }
    })
    //获取分类信息
    
    
    
    const {category:_category,getCategoryAll}= common()
    watch(()=>_category.item,(value)=>{
      category.item=value
    })
    
    //------------------------ 生命周期  ----------------------------
    onMounted(()=>{
      getCategoryAll()
    })


    return {
      // ----------  ref   --------------
      category_first_input,category_second_input,is_Disabled,submit_type,
      // -------  reactive --------------
      form,
      category,
      // -------  methods --------------
      addFirstCate,submit,addSecondCategory,doEditCategory,deleteCategory,getCategoryAll,editCategory
    }
  },
}
</script>
<style lang="scss" scoped>
#category {
  padding-top: 22px;
  .el-button--danger__aa {
    width: 130px;
    height: 40px;
    padding: 0 !important;
    line-height: 30px;
  }
  hr {
    margin-top: 20px;
    margin-left: -42px;
    margin-right: -20px;
    border: none;
    border-bottom: 1px solid #c4c4c4;
  }
  .category-wrap {
    div:first-child {
      &:before {
        top: 20px;
      }
    }
    div:last-child {
      &:before {
        bottom: 21px;
      }
    }
  }
  .menu-title {
    line-height: 44px;
    padding-left: 22px;
    background-color: #f3f3f3;
  }
  .category {
    position: relative;
    line-height: 44px;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      left: 22px;
      top: 0;
      bottom: 0;
      width: 32px;
      border-left: 1px dotted #000;
    }
    h4 {
      position: relative;
      padding-left: 40px;
    }
    svg {
      position: absolute;
      left: 10px;
      top: 15px;
      background-color: #fff;
      font-size: 17px;
    }
    li {
      position: relative;
      padding-left: 36px;
      margin-left: 24px;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 22px;
        width: 32px;
        border-bottom: 1px dotted #000;
      }
    }
    li,
    h4 {
      @include webkit(transition, all 0.5s ease 0s);
      &:hover {
        background-color: #f3f3f3;
        .button-group {
          display: block;
        }
      }
    }
  }
  .button-group {
    display: none;
    position: absolute;
    z-index: 2;
    right: 11px;
    top: -1px;
    button {
      font-size: 12px;
    }
  }
  .from-wrap {
    width: 410px;
  }
  .hr-e9e9e9 {
    width: calc(100% + 60px);
    margin-left: -30px;
    border: none;
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e9e9e9;
  }
}
</style>