import { MessageBox } from 'element-ui';

export default {
    install (Vue, ) {//通过prototype原型
      Vue.prototype.comfirm = ({content,tip,type,center,callback}) =>{
        MessageBox.confirm(content, tip, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type,
            center: center
          }).then(() => {
            // 切记函数加括号为调用   如果存在就调用
            callback && callback()
          }).catch(() => {
            
          });
      }
    }
  }

//   Plugin Test 插件