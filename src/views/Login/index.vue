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
          
          <el-form-item prop="code" class="from_item"> 
              <label for="code" class="menu_name" >验证码</label>
              <el-row :gutter="20" prop="age" class="from_item">
                <el-col :span="15">
                    <el-input id="code" v-model.number="ruleForm.code"></el-input>
                </el-col>
                <el-col :span="9">
                    <el-button type="success" class="black">获取验证码</el-button>
                </el-col>
              </el-row>
          </el-form-item>

          <el-form-item >
            <el-button type="danger" @click="submitForm('ruleForm')" class="black">提交</el-button>
          </el-form-item>
        </el-form>


    </div>
  </div>
</template>


<script>
import {validatas_inputValue} from "@/utils/vaildatas.js"

export default {
  name: "login",
  data(){
    //Rule验证的字段  value 输入的值   callback验证后要做什么(回调函数)
    //验证码
    var validateCode = (rule, value, callback) => {
      console.log(value)
      console.log(validatas_inputValue(value))
        let reg = /^[a-z0-9]{6}$/;//单一的数字或者字母
        if (!value) {
          return callback(new Error('请输入验证码'));
        }else if(!reg.test(value)){
          return callback(new Error('请输入单一的6位数字或者字母'));
        }else{
          callback();
        }
    };
    //邮箱
    var validateUsername = (rule, value, callback) => {
         let reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else if(!reg.test(value)) {
          callback(new Error('邮箱格式错误'));
        }else{
          callback();
        }
    };
    // 密码
    var validatePassword = (rule, value, callback) => {
        let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(!reg.test(value)) {
          callback(new Error('请输入数字+字母的格式'));
        }else{
           callback();
        }
    };
    return{
      mentTab:[
        {txt:"登录",current:false},
        {txt:"注册",current:true}
      ],
      //表单的双向绑定数据
      ruleForm: {
        username: '',
        password: '',
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
