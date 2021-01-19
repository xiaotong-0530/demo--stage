<template>
    <div>
        <!-- my_info_dailog和info_dailog关闭 才具备第二次点击变成true的条件 -->
        <el-dialog title="新增" :visible.sync="my_info_dailog" width="580px" @close='close' @opened="opened" append-to-body >
            <el-form :model="form">
                <el-form-item label="用户名 :" prop="pass" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.pass" autocomplete="off" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="姓名 :" prop="checkPass" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.checkPass" autocomplete="off" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="手机号 :" prop="age" :label-width="formLabelWidth">
                    <el-input v-model.number="form.age" placeholder="请输入内容"></el-input>
                </el-form-item>

                <el-form-item label="地区:" :label-width="formLabelWidth"  > 
                    <el-select v-model="form.category" placeholder="请选择" style="width:130px" @click="one_submit">
                        <el-option v-for="cate in category " :key="cate.id" :label="cate.category_name" :value="cate.id"></el-option>
                    </el-select>
                    <el-select v-model="form.category" placeholder="请选择" style="width:130px">
                        <el-option v-for="cate in category " :key="cate.id" :label="cate.category_name" :value="cate.id"></el-option>
                    </el-select>
                    <el-select v-model="form.category" placeholder="请选择" style="width:130px">>
                        <el-option v-for="cate in category " :key="cate.id" :label="cate.category_name" :value="cate.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="禁/启用 :" :label-width="formLabelWidth" >
                    <el-radio-group v-model="form.resource">
                        <el-radio label="禁用"></el-radio>
                        <el-radio label="启用"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色:" :label-width="formLabelWidth" >
                    <el-checkbox-group v-model="form.type">
                    <el-checkbox label="系统管理员" name="type" value="1"></el-checkbox>
                    <el-checkbox label="信息管理员" name="type" value="1"></el-checkbox>
                    <el-checkbox label="用户管理员" name="type" value="1"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                
            </el-form>
           
            <div slot="footer" class="dialog-footer">
                <el-button @click="close" style="width:110px">取消</el-button>
                <el-button type="danger" style="width:110px" @click="submit">确定</el-button>
            </div> 
        </el-dialog>
    </div>
</template>
<script>
// 单项数据流  父组件传递的参数子组件可以使用 但是不能直接修改
import {reactive,ref,watch} from '@vue/composition-api'
import {add_news,yingxian} from "../../../api/info"
export default{
    // --------------------------------------------vuex 3.0-----------------------------------------------
    props:{
        info_dailog:{//里面可以写type类型 默认值  valia校验规则 
            type:Boolean,
            default:false
        },
        category:{
            type:Array,
            default:[]
        }
    },
    setup(props,{root,emit}){

        /////////////////////////////////////////// data /////////////////////////////////////////////////
        
        const my_info_dailog=ref(false)
        const formLabelWidth=ref('80px')
        const form = reactive({
           pass:"",
           checkPass:"",
           age:"",
           resource:"",
           type:[]
        })
        
        const labelPosition=ref("right")
        /////////////////////////////////////////// methods //////////////////////////////////////////////
        const one_submit=(()=>{
            const data={
                type:"province"
            }
            yingxian(data).then(res=>{

            })
        })
        
        const opened=(()=>{
            
        })

        const submit=(()=>{
            //字段都是必填了提交
            if(!form.category){
                root.$message({ 
                    type: 'info',
                    message: "分类必须填写",
                    duration:1000
                })
                return false
            }
           const data={
               categoryId:form.category,
               title:form.title,
               content:form.content
           }
           add_news(data).then((res)=>{
               root.$message({ 
                    type: 'success',
                    message: "填写信息成功",
                    duration:1000
                })
                close()
           })
              
 
        })
        //关闭
        const close=(()=>{
            emit('update:info_dailog',false)
            reset()
            //通知父组件最新数据
            emit("loadNews")
        })
        //重置
        const reset=(()=>{
            form.category='',
            form.title='',
            form.content=""
        })
        ////////////////////////////////////////// watch /////////////////////////////////////////////////
        watch (()=>props.info_dailog,(newValue,oldValue)=>{
            my_info_dailog.value=newValue
        })

        return{
            // ref
            my_info_dailog,
            formLabelWidth,labelPosition,
            // reactive
            form,one_submit,
            // methods
            close,opened,submit
        }
   
    },
}
</script>
<style lang="scss" scoped>
    
</style>