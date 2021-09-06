// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      // 配置跨域，请求后端接口
      '/api': {
        target: 'http://47.107.38.211:8080',//源地址
        changeOrigin: true,//是否允许跨域
        // ws: false,//是否代理websockets
        pathRewrite: {
          '^/api': '/'
        }
      },
    },
  },
}
