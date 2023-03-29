const {defineConfig} = require('@vue/cli-service')
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path')
const productionGzipExtensions = ['js', 'css']

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = defineConfig({
    transpileDependencies: true,
    assetsDir: 'static',
    parallel: false,
    publicPath: './',
    chainWebpack: config => {
        //路径配置
        config.resolve.alias.set('@', resolve('src'))
    },
    // 配置webpack 打包压缩
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 仅在生产环境下启用该配置
            config.plugins.push([
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 1024, // 只有大小大于该值的资源会被处理,当前配置为对于超过1k的数据进行处理，不足1k的可能会越压缩越大
                    minRatio: 0.99, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: true // 删除原文件
                })
            ])
        }
    },
    // 配置转发代理
    devServer: {
        allowedHosts: "all",
        port: 8080,
        proxy: {
            '/': {
                target: process.env.VUE_API_BASE_URL, // 对应的代理地址
                secure: false, // 接受运行在https上，默认不接受
                ws: false, // 需要websocket 开启
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            }
        }
    }
})
