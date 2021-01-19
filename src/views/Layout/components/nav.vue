<template>
  <div id="nav_wrap">
      <!-- logo -->
      <div class="logo">
        <img src="../../../assets/logo.png" alt="" />
      </div>
      <!-- 菜单列表开始 -->
      <div class="content">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse" background-color="transparent"  text-color="#fff" active-text-color="#fff" router>
            <template v-for="(item,index) in routes" >
              <el-submenu :index="index+``" :key="index" v-if="!item.hidden">
                <!-- 一级路由 -->
                <template slot="title">
                  <svg-icon  :iconName="item.meta.icon" :iconClass="item.meta.icon" />
                  <span slot="title">{{item.meta.name}}</span>
                </template>
                <!-- 二级路由 -->
                <template v-for="(itemChild,index) in item.children">
                  <el-menu-item :index="itemChild.path" v-if="!itemChild.hidden" :key="index">{{itemChild.meta.name}}</el-menu-item>
                 </template>
              </el-submenu>
            </template>
        </el-menu>
      </div>
      
       




  </div>
</template>

<script>
import {computed, reactive ,ref, watch } from "@vue/composition-api";
import Svgicon from "../../../Icons/component/Svgicon.vue"

export default {
 
  components:{Svgicon},
   name: "Main",
  setup(prop, {root,refs }) {

    //读取vuex中的state
    const isCollapse = computed(()=>{
      return root.$store.getters["app/isCollapse"]
    })
    //获取路由对象
    watch(()=>root.$router.options.routes,(value)=>{
        console.log("-->",222222)
    })
    const routes=reactive(root.$router.options.routes)

    return {
      isCollapse,
      routes
    };

  },
};

</script>
<style lang="scss" scoped>
#nav_wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $NavWiedth;
  height: 100vh;
  background: #344a5f;
  @include webkit("transition",all 2s ease 0s);
  .logo {
    text-align: center;
    margin-bottom: 20px;
    img {
      width: 70px;
      margin-top: 30px;
    }
  }
}
.open{
  #nav_wrap{
    width: $NavWiedth;
    img{
      @include webkit("transition",all 2s ease 0s);
    }
  }
}
.close{
  #nav_wrap{
     width: 65px;
     img{
       width: 30px;
       margin-top: 30px;
       @include webkit("transition",all 2s ease 0s);
     }
  }
}
  
</style>
