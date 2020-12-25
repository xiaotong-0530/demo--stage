<template>
  <div class="main">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "Home",
  setup(prop,{refs}){

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