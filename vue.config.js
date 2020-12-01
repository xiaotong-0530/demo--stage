//path
const path = require("path")
// console.log("项目中某个目录的绝对路径",path.resolve(__dirname,"./src/components"))
//C:\Users\lenovo\Desktop\实训\demo--stage\src\components

//commonjs  规范  node.js的规范
module.exports  = {
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true, 
		// 开启 CSS source maps?
		sourceMap: true,
		// css预设器配置项
		loaderOptions: {
			scss: {
				prependData: `@import "./src/styles/main.scss";`
			}
		}, 
    },
    lintOnSave:false,//是否开启语法检测
   
    configureWebpack: (config) => {
        config.resolve = {
             // 引入文件的时候不写后缀，默认加载
            extensions: ['.js', '.json', '.vue'],
            alias: {
                // 获取绝对路径
                "@c": path.resolve(__dirname, './src/components'),
                "@a": path.resolve(__dirname, './src/assets'),
                "@p": path.resolve(__dirname, './public'),
                // 以vue结尾的
                vue$: "vue/dist/vue.esm.js"
            }
           
        }
    }

}