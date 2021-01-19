<template>
    <div>
       <el-dialog :title="data.title" :visible.sync="data.my_user_dailog" @close="close" @open="open"   @opened='opened' width="700px" append-to-body >
            <el-form  ref="user" :model="data.form" :rules="data.rules">
                <el-form-item label="用户名:" label-width="80PX" prop="username">
                    <el-input v-model="data.form.username" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="密码:" label-width="80PX" prop="password">
                    <el-input v-model="data.form.password" placeholder="请输入6-20数字+字母"></el-input>
                </el-form-item>
                <el-form-item label="姓名:" label-width="80PX" prop="truename">
                    <el-input v-model="data.form.truename" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号:" label-width="80PX" prop="phone">
                    <el-input v-model="data.form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="地区:" label-width="80PX" prop="region">
                  <citySelect   :region.sync="data.form.region" ref="city"/>
                </el-form-item>
                <el-form-item label="是否禁用:" label-width="80PX" >
                    <el-radio v-model="data.form.status" :label="1">禁用</el-radio>
                    <el-radio v-model="data.form.status" :label="2">启用</el-radio>
                </el-form-item>
                <!-- 角色 -->
                <el-form-item label="角色:" label-width="80PX" prop="role">
                    <el-checkbox-group v-model="data.form.role">
                        <template v-for="role in data.roles">
                            <el-checkbox :key="role.role" :label="role.name" name="type">{{role.name}}</el-checkbox>
                        </template>
                    </el-checkbox-group>
                </el-form-item>
                <!-- 按钮权限 -->
                <el-form-item label="按钮权限:" label-width="80PX" prop="btnPerm">
                    <template v-for="but in data.btnPrem">
                        <div :key="but.name"> 
                            <h4>{{but.name}}</h4>
                            <el-checkbox-group v-model="data.form.btnPerm"> 
                                <el-checkbox v-for="perm in but.perm" :key="perm.value" :label="perm.value" >{{perm.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                       
                    </template>
                </el-form-item>
                <!-- 按钮 -->
                <el-row :gutter="30">
                    <el-col :span="12" >
                        <el-button type="" style="width:130px" @click="close" class="pull_right">取消</el-button>
                    </el-col>
                    <el-col :span="12" >
                        <el-button type="danger" style="width:130px"  @click="submit" class="pull_left">提交</el-button>
                    </el-col>
                </el-row>
            </el-form>
       </el-dialog>
    </div>
</template>
<script>
import { ref,reactive ,watch} from '@vue/composition-api'
import citySelect from "../../../components/City/index.vue"
import {get_permission,get_role,add_users,edit_user} from "@/api/user.js"
import dataobject from "@/utils/vaildatas.js"

export default{
    props:{
        showDialog:{
            type:Boolean,
            default:false
        },
        dialogData:{
            type:Object,
            default:{}
        }
    },
    components:{citySelect},
    setup(props,{root,emit,refs}){
        //校验表单
        let validatePassword = (rule, value, callback) => {
            //过滤非法字符
            data.form.password = value = dataobject.validatas_inputValue(value,"password")
            
            if (value === '') {
                callback(new Error('请输入密码'));
            }else if(dataobject.test_password(value)) {
                callback(new Error('请输入数字+字母的格式'));
            }else{
                callback();
            }
        };


        const data =reactive({
            my_user_dailog:false,
            title:"新增",
            form:{ 
                username:"",//用户名
                password:"",//密码
                truename:"",//真实姓名
                phone: "", //手机号
                region:{},//地区
                status: 1,//禁用1 启用2
                btnPerm:[],//拥有权限
                role: [],//角色
            },
            roles:[],
            rules:{//表单校验
                role: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ],
                 password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
            },
            btnPrem:[],
            type:null
        })

        watch(()=>props.showDialog,(value)=>{
            data.my_user_dailog=value
        })
        //相当于取消按钮
        const close=(()=>{
            //清空表单数据
			// refs['user'].resetFields()
			data.form.username=''
			data.form.password='', //密码
			data.form.truename='',//真实姓名
			data.form.phone='',// 手机号
			data.form.region={},//地区 
			data.form.status='1',// 禁用1  启用 2
			data.form.btnPerm=[],//拥有权限
			data.form.role=[],// 角色
            emit("update:showDialog",false)//来回切换子传父
            // refs["user"].resetFields()//对表单进行清空
            data.type=null
        })
        //角色和按钮权限的接口数据
        const getRoleAndpermission=(()=>{
            get_role({}).then(res=>{
               data.roles= res.data.data
            })
            get_permission({}).then(res=>{
                data.btnPrem=res.data.data
            })
        })

        //打开之前设置表单中的相关内容
        const open=(()=>{
            getRoleAndpermission()
            
           if(props.dialogData.id){
				data.title='编辑'
				//表单数据初始化 
				for(let key in props.dialogData){
					data.form[key]=props.dialogData[key]
				}
				//role btnPrem string --> array 
				data.form.role = props.dialogData.role.split('/')
				data.form.btnPerm = props.dialogData.btnPerm.split('/')
				data.form.region = JSON.parse(props.dialogData.region)
				data.type='编辑'
			}else{
                data.title='新增'
            }	
        })
        const opened = ()=>{
			//让城级联动组件 选中默认值
			if(data.type=='编辑'){
				refs['city'].selectDefaultvalue()
			}
			
			refs['city'].getProvince()

		}
        //确定按钮
        const submit=(()=>{
            refs['city'].cache_city()
			refs['user'].validate((flag)=>{
				if(flag){
					console.log(data.form.region)
					const _data = {
						username:data.form.username,
						truename:data.form.truename,
						password:data.form.password,
						phone:data.form.phone,
						status:data.form.status,
						role:data.form.role.join(),
						btnPerm:data.form.btnPerm.join(),
						region:JSON.stringify(data.form.region),
					}
					if(props.dialogData.id){ //提交 修改
						_data.id = props.dialogData.id
						edit_user(_data).then(res=>{
							root.$message({
								type:'success',
								message:"修改成功",
								duration:1000
							})
							close()
						})
					}else{//提交 新增
                        
						add_users(_data).then(res=>{
							root.$message({
								type:'success',
								message:"新增成功",
								duration:1000
							})
							close()
						})
					}
				}else{
					root.$message({
						type:'error',
						message:'表单数据验证不通过'
					})
				}
			})
        })

        return{
           data,close,open,submit,opened
        }
 
    },
}
</script>
<style lang="scss" scoped>
    
</style>