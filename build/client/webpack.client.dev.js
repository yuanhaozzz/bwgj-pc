let merge = require('webpack-merge');
let config = require('../webpack.base.js');
let path = require('path');
let webpack = require('webpack');
// 根据模板生成打包后的html 自动引入打包后的资源路径
let HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 删除dist目录
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 打包分析
let _path = _path => path.resolve(__dirname, _path);


module.exports = merge(config, {
    mode: 'development',
    entry: {
        // polyfill 兼容低版本  试试不加 因为在preset-env中 已经制定usebuiltInt
        // webpack-hot-middleware 热更新
        app: ['webpack-hot-middleware/client?noInfo=true&reload=true', "@babel/polyfill", _path('../../client/main.js')]
    },
    devtool: 'inline-source-map',
    // 外部引入  在指定后  需要在html中引入该资源
    // externals
    output: {
        path: _path('../../dist/live'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/live'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, '../../client'),
                    path.resolve(__dirname, '../../server')
                ],
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            configFile: path.resolve('.eslintrc'),
                            eslint: {
                                configFile: path.resolve(__dirname, '.eslintrc')
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // filename: 'css/[name].[contenthash:8].css'
            filename: 'css/[name].css'
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'react 服务端渲染',
            template: _path('../../index.html')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // Use NoErrorsPlugin for webpack 1.x
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, '../../static'), to: path.resolve(__dirname, '../../dist/live/static'), ignore: ['.*'] }
        ]),
    ]
});