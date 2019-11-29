
let merge = require('webpack-merge')
let baseConfig = require('../webpack.base')
let path = require('path')
const nodeExternal = require('webpack-node-externals')

require('ignore-styles');
let a = require('@babel/register');
a()
require('./server.js')

module.exports = merge(baseConfig, {
    target: 'node',
    mode: 'production',
    entry: {
        server: path.resolve(__dirname, '../../server/test.js')
    },
    // 负责检测所有引入不得node的核心模块，并且通知webpack不需要将核心代码打入到server.js 文件中去
    externals: [nodeExternal()],
    output: {
        path: path.resolve(__dirname, '../../dist/server'),
        filename: '[name].js',
        // 将使用的第三方库打包为node环境
        libraryTarget: 'commonjs2'
    },
})