<template>
  <div  class="header">
    <!-- 左面 -->
    <div class=" header_menu" @click="toggleMenu">
      <svg-icon  iconName="menu" />
    </div>
    <!-- 右面 -->
    <div class=" header_head">
      <div class="pull_left header_photo">
        <img src="../../../assets/1.jpg" alt="">
        <span >管理员</span>
      </div>
      <div class="pull_right kaiguan">
        <svg-icon  iconName="kaigun" />
      </div>
      
    </div>
  </div>
</template>

<script>
export default { 
  name: "Header",
  setup(props,{root,refs}){
    //触发vuex mutations
    const toggleMenu=(()=>{
         root.$store.commit("app/SET_COLLAPSE")
    })

    return{
       toggleMenu
    }
      
  }
};
</script>

<style lang="scss" scoped>
.header{
    position: fixed;
    display: flex;
    justify-content: space-between;
    top: 0px;
    right: 0;
    left:$NavWiedth;
    background:white;
    height:$LayoutHeader;
    @include webkit("transition",all 2s ease 0s);
    .header_menu{
      width:22px;
      margin:30px;
      .svg-icon{
        color:#384b5c !important;
      }
    }
    .header_photo{
      height:75px;
      padding:0 30px;
      border-right:1px solid #cccccc;
      img{
          width:40px  ;
          height:40px  ; 
          display: inline-block;
          background-color: red !important ;
          margin:20px 20px 0 0;
          border-radius: 50%;
      }
      span{
        height:$LayoutHeader !important;
        float: right;
        line-height: 80px !important;
      }
    }
    .kaiguan {
        padding:30px;
        display: block;
        .svg-icon{
        color:#384b5c !important;
      }
    }
}  
.open{
  .header{
    left:$NavWiedth;
  }
}
.close{
  .header{
     left: 65px;
  }
}
</style>