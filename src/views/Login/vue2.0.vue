<template>
  <div class="login">
    <div class="login_wrap">
        <ul class="menu">
          <li :class="{'current':item.current}" v-for="(item,index) in mentTab" :key="index" @click="toggleMent(item)" >{{item.txt}}</li>
        </ul>
        <!-- element Ui -->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm" size="medium ">
          <el-form-item  prop="username" class="from_item">
            <label for="username" class="menu_name">邮箱</label>
            <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item prop="password" class="from_item" >
            <label for="password" class="menu_name">密码</label>
            <el-input id="password" type="text" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item v-if = 'mode =="register" '  prop="password1" class="from_item" >
            <label for="password1" class="menu_name">重复密码</label>
            <el-input id="password1" type="text" v-model="ruleForm.password1" autocomplete="off"></el-input>
          </el-form-item>
          
          <el-form-item prop="code" class="from_item"> 
              <label for="code" class="menu_name" >验证码</label>
              <el-row :gutter="20" prop="age" class="from_item">
                <el-col :span="15">
                    <el-input id="code" v-model="ruleForm.code"></el-input>
                </el-col>
                <el-col :span="9">
                    <el-button type="success" class="black">获取验证码</el-button>
                </el-col>
              </el-row>
          </el-form-item>

          <el-form-item >
            <el-button type="danger" @click="submitForm('ruleForm')" class="black">{{this.mode=="login" ? "登录":"注册"}}</el-button>
          </el-form-item>
        </el-form>


    </div>
  </div>
</template>


<script>
import dataobject from "@/utils/vaildatas.js"

export default {
  name: "login",
  data(){
    //Rule验证的字段  value 输入的值   callback验证后要做什么(回调函数)
    //邮箱
    var validateUsername = (rule, value, callback) => {
      //过滤
        this.ruleForm.username = value = dataobject.validatas_inputValue(value,"email")
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else if(dataobject.test_email(value)) {
          callback(new Error('邮箱格式错误'));
        }else{
          callback();
        }
    };
    // 密码
    var validatePassword = (rule, value, callback) => {
      //过滤
        this.ruleForm.password = value = dataobject.validatas_inputValue(value,"password")
        
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(dataobject.test_password(value)) {
          callback(new Error('请输入数字+字母的格式'));
        }else{
           callback();
        }
    };

   //重复密码
    var validatePassword1 = (rule, value, callback) => {
      //过滤
        this.ruleForm.password1 = value = dataobject.validatas_inputValue(value,"password1")
        
        if (value !== this.ruleForm.password) {
          callback(new Error('两次密码输入不一致'));
        }else{
           callback(); 
        }
    };


    //验证码
    var validateCode = (rule, value, callback) => {
      //过滤
        this.ruleForm.code = value = dataobject.validatas_inputValue(value,"code")
        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if(dataobject.test_code(value)){
          return callback(new Error('请输入单一的6位数字或者字母'));
        }else{
          callback();
        }
    };




    return{
      mode:"login",
      mentTab:[
        {txt:"登录",current:true,type:"login"},
        {txt:"注册",current:false,type:"register"}
      ],
   
      //表单的双向绑定数据
      ruleForm: {
        username: '',
        password: '',
        password1: '',
        code: ''
      },
      //验证规则 校验方式
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        password1: [
          { validator: validatePassword1, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      }
    };
  },
    
  methods:{
    //登录注册切换
    toggleMent(item){
      //对表单的每一个字段进行验证
      this.mentTab.map(item => item.current =false)
      item.current=true;
      this.mode=item.type//点击的时候让重复密码出来
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit成功!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      
    }
  }
}


</script>
<style lang="scss" scoped>
.login{
  height:100vh;
  background-color :#344a5f;
  display: flex;
}
.login_wrap{
  width:330px;
  // height:350px;
  // background-color: #91da90;
  margin:150px auto ;
}
.menu{
  text-align: center;
  margin-bottom:30px;
  li{
      display: inline-block;
      width:88px;
      height:36px;
      // background:#304256;
      font-size: 14px;
      line-height: 36px;
      color:white;
  }
  .current{
    background: rgba(0,0,0,.1);
  }
}
.menu_name{
    display: block;
    color:white;
    margin-bottom:3px;
    text-align: left;
}
.from_item{
    margin-bottom:24px;
}
.black{
  display: block;
  width:100%;
}
</style>
