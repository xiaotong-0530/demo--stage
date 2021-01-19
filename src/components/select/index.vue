<template>
  <div>
    <el-select v-model="data.defaultValue" placeholder="ID" @change="select"  >
      <el-option :label="item.label" :value="item.value" v-for="item in data.option" :key="item.name" ></el-option>
    </el-select>
  </div>
</template>

<script>
import { onMounted, reactive,ref} from '@vue/composition-api';
export default {
  props:{
    option:{
      type:Object,
      default:{}
    },
    selectValue:{
      type:Object,
      default:{}
    }
  },


  setup(props,{refs,root,emit}){

    const data=reactive({
        defaultValue:"请选择",
        option:[
          {value:"name",label:"姓名"},
          {value:"id",label:"ID"},
          {value:"title",label:"标题"},
          {value:"email",label:"邮箱"}, 
          {value:"phone",label:"电话"}
        ]
    })
    const initOption=(()=>{
      let option_arr=[]
      //判断是否传递init数据
      if(props.option.init.length==0){
        root.$message({
          type:"error",
          message:"初始化的init未传值"
        })
        return false
      }

      props.option.init.forEach(item=>{
        let arr = data.option.filter(_item=>_item.value===item)
        if(arr.length>0){
          // option_arr.push(arr[0])
          option_arr=[...option_arr,...arr]
        }
      })
      //传了但是没有匹配到
      if(option_arr.length==0){
        root.$message({
          type:"error",
          message:"select初始化的init未传值"
        })
      }

      data.option = option_arr
      // data.defaultValue = option_arr.length>0?option_arr[0].value:data.defaultValue
      select(option_arr[0].value)//一开始显示第一个的值
 
    })
    
    const select =((value)=>{ 
      let _select=data.option.filter(item=>item.value== value)[0]
      emit("update:selectValue",_select)
    })

    onMounted(()=>{
      initOption()
    })

    return{
       data,select
    }
  }
 
};
</script>

<style scoped lang="scss">

</style>
