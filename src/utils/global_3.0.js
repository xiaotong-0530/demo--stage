import {ref} from "@vue/composition-api";
import { MessageBox } from 'element-ui';

export const global=()=> {

    const comfirm=({content,tip,type,center,callback,id})=>{
        MessageBox.confirm(content, tip, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type,
            center: center
        }).then(() => {
        // 切记函数加括号为调用   如果存在就调用
            callback && callback(id)

        }).catch(() => {
        
        });
    }
    
    return {
        comfirm  
    }

}
