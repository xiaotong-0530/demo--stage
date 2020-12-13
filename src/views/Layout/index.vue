<template>
  <div :class="[isCollapse ? 'close':'open']" >
    <Layoutheader/>
    <Layoutmain/>
    <Layoutnav/>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api';

import Layoutheader from "../Layout/components/header"
import Layoutmain from "../Layout/components/main"
import Layoutnav from "../Layout/components/nav"

export default {
  name: "Home",
  setup(prop,{refs,root}){
    const isCollapse=computed(()=>root.$store.getters["app/isCollapse"] )
    
    return{
       isCollapse
    }
     

      
  },

  components:{Layoutheader, Layoutmain,Layoutnav}
};
</script>

<style lang="scss" scoped>

</style>