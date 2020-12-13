//path
const path = require("path")
// console.log("项目中某个目录的绝对路径",path.resolve(__dirname,"./src/components"))
//C:\Users\lenovo\Desktop\实训\demo--stage\src\components

//commonjs  规范  node.js的规范
module.exports  = {
    //基本路径
    publicPath:process.env.NODE_ENV==="production" ? '' : '/',

    //解析svg的loader
    chainWebpack:(config)=>{
        const svgRule = config.module.rule("svg");     
            svgRule.uses.clear();     
            svgRule       
              .use("svg-sprite-loader")       
              .loader("svg-sprite-loader")       
              .options({         
                symbolId: "icon-[name]",         
                include: ["./src/icons"]       
              });  
    },




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
                "@": path.resolve(__dirname, './src'),
                "@c": path.resolve(__dirname, './src/components'),
                "@a": path.resolve(__dirname, './src/assets'),
                "@p": path.resolve(__dirname, './public'),
                // 以vue结尾的
                vue$: "vue/dist/vue.esm.js"
            }
           
        }
    },
    //代理
    devServer:{
        port:8010,
        open:true,
        //代理
        proxy:{
            // http://localhost:8081/api/getSms/
            // http://www.web-jshtml.cn/productapi/getSems/   没有token业务的接口
            // http://www.web-jshtml.cn/productapi/token/getSems/   没有token业务的接口
            '/api':{
                target:"http://www.web-jshtml.cn/productapi/token/",//目标接口
                changeOrigin:true,//生成一个Localhost:8080域名下一个node服务器,帮你做代理,
                //重写url
                pathRewrite:{
                    '^/api':''
                }
            }
        }
        
    }
}




