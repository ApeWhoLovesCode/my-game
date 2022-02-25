// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      // 配置跨域，请求后端接口
      '/api': {
        // target: 'http://localhost:3000',//源地址
        target: 'http://120.77.241.208:3000',//源地址
        changeOrigin: true,//是否允许跨域
        pathRewrite: {
          '^/api': '/'
        }
      },
    },
  },
}
