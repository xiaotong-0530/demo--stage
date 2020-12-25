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
                    <el-button type="success" :disabled="codeButtonStatus" class="black " @click="getCode">{{codeButtonText}}</el-button>
                </el-col>
              </el-row>
          </el-form-item>
          <el-form-item >
            <el-button type="danger" @click="submitForm('ruleForm')" class="black" :disabled="buttonStatus">{{this.mode=="login" ? "登录":"注册"}}</el-button>
          </el-form-item>
        </el-form>

    </div>
  </div>
</template>

<script>
import dataobject from "@/utils/vaildatas.js"
import {onMounted, reactive,ref} from "@vue/composition-api";
import {get_code,do_register,do_login} from "@/api/login.js"
export default {
  name: "login",
  setup(prop, {refs,root}) {
    //-------------------------------------生命周期----------------------------------------------
     

    //----------------------------------------------------data------------------------------------------------------------
      const status_username=ref(false)
      const status_password=ref(false)
      const status_password1=ref(false)



    //Rule验证的字段  value 输入的值   callback验证后要做什么(回调函数)
      //邮箱
      let validateUsername = (rule, value, callback) => {
        //过滤
        ruleForm.username = value = dataobject.validatas_inputValue(value,"email")
          if (value === '') {
            status_username.value=false
            callback(new Error('请输入邮箱'));
          } else if(dataobject.test_email(value)) {
            callback(new Error('邮箱格式错误'));
          }else{
            status_username.value=true
            callback();
          }
      };
      //密码
      let validatePassword = (rule, value, callback) => {
        //过滤
          ruleForm.password = value = dataobject.validatas_inputValue(value,"password")
          
          if (value === '') {
            status_password.value=false
            callback(new Error('请输入密码'));
          }else if(dataobject.test_password(value)) {
            callback(new Error('请输入数字+字母的格式'));
          }else{
            status_password.value=true
            callback();
          }
      };
      //重复密码
      let validatePassword1 = (rule, value, callback) => {
        //过滤
          ruleForm.password1 = value = dataobject.validatas_inputValue(value,"password1")
          
          if (value !== ruleForm.password) {
            status_password1.value=false
            callback(new Error('两次密码输入不一致'));
          }else{
            status_password1.value=true
            callback(); 
          }
      };
      //验证码
      let validateCode = (rule, value, callback) => {
        //过滤
          ruleForm.code = value = dataobject.validatas_inputValue(value,"code")
          if (!value) {
            return callback(new Error('请输入验证码'));
          }else if(dataobject.test_code(value)){
            return callback(new Error('请输入单一的6位数字或者字母'));
          }else{
            callback();
          }
      };

      //定义tab切换模式
      const mode=ref("login");
      const mentTab=reactive([
        {txt:"登录",current:true,type:"login"},
        {txt:"注册",current:false,type:"register"}
      ]);
      //表单的双向绑定数据
      const ruleForm=reactive( {
        username: '',
        password: '',
        password1: '',
        code:''
      });
      //验证规则 校验方式
      const rules=reactive({
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
      })
      //定义按钮禁用和启用
      const buttonStatus=ref(true)
      //定义登录注册按钮的禁用和启用
      const codeButtonStatus=ref(false)
      //定义验证码按钮文本
      const codeButtonText=ref("获取验证码")
      //定义验证码延迟定时器
      const timer_delay=ref(null)
      //定义 验证码倒计时定时器
      const timer_count_down=ref(null)



    //----------------------------------------------------方法---------------------------------------------------
      //登录注册切换
      const toggleMent=(item)=>{
        //对表单的每一个字段进行验证
        mentTab.map(item => item.current =false)
        item.current=true;
        mode.value=item.type//点击的时候让重复密码出来
        //点击切换对内容进行重置
        
        //还原验证码相关态度
        resetCodeButton()
        //还原登录注册按钮状态
        buttonStatus.value=true
        refs["ruleForm"].resetFields()


      }
      const submitForm=(formName)=>{
        refs[formName].validate((valid) => {
          if (valid) {
            //执行登录注册
            mode.value === "login" ? doLogin() : doRegister()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
      const resetForm=(formName)=>{
        refs[formName].resetFields();
      }
      //获取验证码
      const getCode=()=>{
        //判断邮箱格式  密码  重置密码 的格式
        const {result,filed}=validataFileds()
        let offset=0
        // 判断邮箱格式 密码 重复密码的格式
        if(!result){//true 验证通过 false 验证未通过
            filed.map(item=>{
                offset+=40
                root.$message({
                    type:"error",
                    message:`错误字段:${item.message}`,   //显示错误字段
                    offset:offset,   //间距
                    duration:2000  //延迟2秒
                })
            })
            return false
        }
       
        //让按钮禁用 显示 "发送中"
        setCodeButton({
          status:true,
          text:"发送中"
        })

        //为了模拟网络延迟 定时器 一次性
        timer_delay.value = setTimeout(()=>{
            const data={
              username:ruleForm.username,
              module:mode.value
            }

            get_code(data).then((res)=>{
              // console.log(res)
              //成功信息  获取到对用的验证码
              root.$message.success(res.data.message)
              //显示倒计时
              countDown(10)
              //让登录注册按钮启用
              buttonStatus.value=false
            }).catch((err)=>{
              // console.log(2)
            })
        },1000)
      }

    // ------------------------------------------------辅助方法 函数------------------------------------------------

      //验证定时器的倒时效果
      const countDown=((timer)=>{
          // if(timer_count_down.value){//存在定时器
          //     clearInterval(timer_count_down.value)
          // }

          timer_count_down.value=setInterval(()=>{
            timer--;
            if(timer === 0){ 
                clearInterval(timer_count_down.value)//清除定时器

                //显示重新发送
                setCodeButton({
                  status:false,
                  text:"重新发送"
                }) 
            }else{
              codeButtonText.value=`倒计时${timer}秒`
            }
            
          },1000)
      })

      // 还原验证码的相关状态
      const resetCodeButton=(()=>{
          //默认启用发送中
          setCodeButton({
            status:false,
            text:"获取验证码"
          })
          //清空两个定时器
          clearTimeout(timer_delay.value)
          clearInterval(timer_count_down.value)
      })

      //设置获取验证码的相关状态  封装
      const setCodeButton= ({status,text})=>{
          codeButtonStatus.value=status;
          codeButtonText.value = text;
        // console.log( codeButtonText.value)
      }

      //执行登录
      const doLogin=() =>{
        const data = {
          username: ruleForm.username,
          password: ruleForm.password,
          code: ruleForm.code,
        }
        root.$store.dispatch("app/login",data).then(res=>{
             root.$message.success(res.data.message)
              // 登陆后跳转到首页
              root.$router.push({
                  name:"Home"
              })
        }).catch(err=>{

        })

      }

      //执行注册
      const doRegister = () => {
        const data = {
          username: ruleForm.username,
          password: ruleForm.password,
          code: ruleForm.code,
        }
        //   执行注册
        do_register(data)
          .then((res) => {
            // 提示注册成功
            root.$message.success(res.data.message)
            toggleMent(mentTab[0])
          })
          .catch((err) => {
            
          })
      }
      
      // 获取验证码是验证相关字段
      const validataFileds=()=>{
          let result=status_username.value&&status_password.value
          const _filed_arr=[
              {filed:"username",flag:status_username.value,message:"邮箱格式错误"},
              {filed:"password",flag:status_password.value,message:"密码格式错误"},
              
          ]
          if(mode.value==="register"){
              _filed_arr.push({filed:"password1",flag:status_password1.value,message:"重复密码错误"})
              result=status_username.value&&status_password.value&&status_password1.value
          }
          
          return{
              result:result,
              filed:_filed_arr.filter(item=>!item.flag)
          }
      }

    return{
        mode,
        mentTab,
        ruleForm,
        rules,
        toggleMent,
        submitForm,
        resetForm,
        getCode,
        buttonStatus,
        codeButtonStatus,
        codeButtonText
    }
  }
}


</script>
<style lang="scss" scoped>
.login{
  height:1000px;
  // background-color :#344a5f;
  background-color :rgb(50, 115, 158);
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
