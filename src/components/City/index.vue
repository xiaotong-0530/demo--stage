<template>
  <div>
      <el-row>
          <el-col :span="6">
               <el-select v-model="data.provinceValue" placeholder="请选择" @change="selectProvince">
                    <el-option  v-for="item in data.provinceData" :key="item.PROVINCE_ID" :label="item.PROVINCE_NAME" :value="item.PROVINCE_CODE" ></el-option>
               </el-select>
          </el-col>
          <el-col :span="6">
               <el-select v-model="data.cityValue" placeholder="请选择" @change="selectCity">
                    <el-option  v-for="item in data.cityData" :key="item.CITY_ID" :label="item.CITY_NAME" :value="item.CITY_CODE" ></el-option>
               </el-select>
          </el-col>
          <el-col :span="6">
               <el-select v-model="data.areaValue" placeholder="请选择"  @change="selectArea">
                   <el-option  v-for="item in data.areaData" :key="item.AREA_ID" :label="item.AREA_NAME" :value="item.AREA_CODE" ></el-option>
               </el-select>
          </el-col>
          <el-col :span="6">
               <el-select v-model="data.streetValue" placeholder="请选择"  @change='selectStreet' >
                    <el-option v-for="item in data.streetData" :key="item.STREET_ID" :label="item.STREET_NAME" :value="item.STREET_CODE" ></el-option>
               </el-select>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import {watch, onMounted, reactive,ref} from '@vue/composition-api';
import {get_city} from "../../api/city.js"
import {getCity,setCity} from '@/utils/city_cache.js'
export default {
  props:{
    region:{
      type:Object,
      default:{}
    },
    type:{
			type:Number,
			default:0
		}
  },

  setup(props,{refs,root,emit}){
    const data=reactive({
        flag:true,

        provinceLabel:'',
        provinceValue:"", 
        provinceData:[],//省份

        cityLabel:'',
        cityValue:"", 
        cityData:[],//市

        areaLabel:'',
        areaValue:"", 
        areaData:[],//县

        streetLabel:'',
        streetValue:"",
        streetData:[]//街道
    })
  ////////////////////////  methods  ////////////////////////////////////
    //清除
    const reset =((type)=>{
        let clearType={
          all:["province","city","area","street" ],
          province:["city","area","street"],
          city:["area","street"],
          area:["street"]
        }

        clearType[type].map(type=>{
          data[`${type}Value`]="",
          data[`${type}Data`]=[]
        })
    })

    //省
    const getProvince=()=>{
        get_city({
            type:"province"
        }).then(res=>{
            data.provinceData=res.data.data.data
        })
    }
    //市
    const selectProvince=(value)=>{
        data.flag=true

        reset("province")
        get_city({
            type:"city",
            province_code:value
        }).then(res=>{ 
            data.cityData=res.data.data.data
        })
        findLabel(value,'province')
    }
    //县
    const selectCity=((value)=>{
       data.flag=true

       reset("city")
       get_city({
            type:"area",
            city_code:value
        }).then(res=>{ 
            data.areaData=res.data.data.data
        })
        findLabel(value,'city')
    })
    // 街道
    const selectArea=((value)=>{
      data.flag=true

      reset("area")
       get_city({
            type:"street",
            area_code:value
        }).then(res=>{ 
            data.streetData=res.data.data.data
        })
        findLabel(value,'area')
    })

    const findLabel = (id,level)=>{
			
			data[`${level}Data`].map(item=>{
				if(id==item[`${level.toUpperCase()}_CODE`]){
          data[`${level}Label`] = item[`${level.toUpperCase()}_NAME`]
          console.log(data[`${level}Label`])
					return 
				}
			})
		}

    const selectStreet = ((value)=>{
			data.flag=true
			findLabel(value,'street')
    })
    
    const selectDefaultvalue = ()=>{
			
			const p = props.region.province //220000  --> 山西
			const c = props.region.city
			const a = props.region.area
			const s = props.region.street

			// 将id 转化成 城市信息  1.请求接口 2. 缓存
			
			//获取对应的缓存 
			let cityName =  getCity([p,c,a,s].join('/')).split('/')
			
			data.provinceValue=cityName[0]
			data.cityValue=cityName[1]
			data.areaValue=cityName[2]
			data.streetValue=cityName[3]

			data.flag=false
	
    }
    
		const cache_city = ()=>{
			let province = data.provinceValue
			let city = data.cityValue
			let area = data.areaValue
			let street =  data.streetValue
			if(province && city && area && street ){
				//存储
				let key = [province,city ,area,street].join('/')
				let city_value = [data.provinceLabel,data.cityLabel,data.areaLabel,data.streetLabel].join('/') 
				setCity(key,city_value)
			}
		}
    //监听父组件传递的region属性  如果region为空 让当前的选中为空
    watch(()=>props.region,(value)=>{
        if(Object.keys(value).length===0){
            //父组件重置了
            reset("all")
        }
    })

    //通知父组件 选择的是什么地址信息
    watch([
      ()=>data.provinceValue,
      ()=>data.cityValue,
      ()=>data.areaValue,
      ()=>data.streetValue,
    ],([provinceValue,cityValue,areaValue,streetValue])=>{
      const citySelectObject={
        province:provinceValue,
        city:cityValue,
        area:areaValue,
        street:streetValue
      }
      console.log("--》",citySelectObject)
      if(data.flag){
         emit('update:region',citySelectObject)
      }
     
    })

    onMounted(()=>{
        getProvince()
    
    })

    return{
      data,getProvince,selectProvince,selectCity,selectArea,reset,
      selectStreet,selectDefaultvalue,cache_city
    }
  }
 
};
</script>

<style scoped lang="scss">

</style>
