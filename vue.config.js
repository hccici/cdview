module.exports = {
    devServer: {
        host: "localhost",
        port:
            8090, // 端口号
        https:
            false, // https:{type:Boolean}
        open:
            true, //配置自动启动浏览器
        // 配置多个代理
        publicPath: '/',
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: {
                    '^/api': '/'
                },
                ws: true,//webSocket
                changeOrigin: true
            }
        }
    },
}

