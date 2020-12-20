<template>
    <div>
        <!-- my_info_dailog和info_dailog关闭 才具备第二次点击变成true的条件 -->
        <el-dialog title="新增" :visible.sync="my_info_dailog" width="580px" @close='close' append-to-body>
            
            <el-form :model="form">
                <el-form-item label="类型:" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="标题:" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="请输入内容"></el-input>
                </el-form-item>

                <el-form-item label="概况:" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 操作按钮 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="close" style="width:110px">取消</el-button>
                <el-button type="danger" style="width:110px">确定</el-button>
            </div>

        </el-dialog>
    </div>
</template>
<script>
// 单项数据流  父组件传递的参数子组件可以使用 但是不能直接修改
import {reactive,ref,watch} from '@vue/composition-api'
export default{
    // --------------------------------------------vuex 3.0-----------------------------------------------
    props:{
        info_dailog:{//里面可以写type类型 默认值  valia校验规则 
            type:Boolean,
            default:false
        }
    },
    setup(props,{root,emit}){
        /////////////////////////////////////////// data /////////////////////////////////////////////////
        const my_info_dailog=ref(false)
        const formLabelWidth=ref('60px')
        const form = reactive({
            name: '',
            region: '',
        })
        /////////////////////////////////////////// methods //////////////////////////////////////////////
        const close=(()=>{
            emit('update:info_dailog',false)
        })
        ////////////////////////////////////////// watch /////////////////////////////////////////////////
        watch (()=>props.info_dailog,(newValue,oldValue)=>{
            my_info_dailog.value=newValue
        })

        return{
            // ref
            my_info_dailog,
            formLabelWidth,
            // reactive
            form,
            // methods
            close,
        }

    },
}
</script>
<style lang="scss" scoped>
    
</style>