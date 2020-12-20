import { MessageBox } from 'element-ui';
//自定义

export  const comfirm = ({content,tip,type,center,callback}) =>{
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



// export  const comfirm = ({content,tip,type,center}) =>{
//     return new Promise ((resolve,reject)=>{
//         MessageBox.confirm(content, tip, {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             type: type,
//             center: center
//         }).then(() => {
//         // 切记函数加括号为调用   如果存在就调用
//             resolve("确定")
//         }).catch(() => {
//             reject("取消")
//         });
//     })
// }