<template>
  <div class="main">
    <keep-alive>
      <router-view v-if="$route.meta.keep"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keep"/>
  </div>
</template>

<script>
import {reactive,ref,watch} from '@vue/composition-api'
export default {
  name: "Home",
  setup(prop,{refs,root}){
    //root.$router  挂载到vue更组件所有路由对象 push redirect
    //root.$route   当前激活的路由对象
    watch(()=>root.$route.path,(value1,value2)=>{
      console.log(value1,value2)
    })
    return{
       
    }
      
  }
};
</script>

<style lang="scss" scoped>
.main{
    position: fixed;
    top:$LayoutHeader;
    left:$NavWiedth;
    bottom: 0px;
    right:0px;
    background:white;
    padding-right: 20px;
    padding-left:20px;
    border:20px solid #cccccc;
    border-bottom: none;
    @include webkit("transition",all 2s ease 0s);
}
.open{
  .main{
    left:$NavWiedth;
  }
}
.close{
  .main{
     left: 65px;
  }
}
</style>