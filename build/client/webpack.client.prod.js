let merge = require('webpack-merge');
let config = require('../webpack.base.js');
let path = require('path');
let webpack = require('webpack');
// 根据模板生成打包后的html 自动引入打包后的资源路径
let HtmlWebpackPlugin = require('html-webpack-plugin');
// 删除dist目录
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 压缩js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// 压缩图片 在尽可能小的情况下 保持质量
let ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 打包分析
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let _path = _path => path.resolve(__dirname, _path);

module.exports = merge(config, {
    mode: 'production',
    entry: {
        // polyfill 兼容低版本  试试不加 因为在preset-env中 已经制定usebuiltInt
        app: ["@babel/polyfill", _path('../../client/main.js')],
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'react-router-dom',
            'react-redux',
            'redux'
        ]
    },
    devtool: 'source-map',
    // 外部引入  在指定后  需要在html中引入该资源
    // externals
    output: {
        path: _path('../../dist/live'),
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: '/live'
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false
            })
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {//node_modules内的依赖库
                    chunks: "all",
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    minChunks: 1, //被不同entry引用次数(import),1次的话没必要提取
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                    // enforce: true?
                },
                common: {// ‘src/js’ 下的js文件
                    chunks: "all",
                    test: /[\\/]src[\\/]js[\\/]/, //也可以值文件/[\\/]src[\\/]js[\\/].*\.js/
                    name: "common", //生成文件名，依据output规则
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1
                }
            }
        },
        // untimeChunk将入口提取出来，这样入口文件可以很快加载，并且当哪里有改动的时候，只有改动的地方和这个文件有变化
        runtimeChunk: {
            name: 'manifest'
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'react 服务端渲染',
            template: _path('../../index.html')
        }),
        // 将类库 打包为生产版本  如果不指定 库会有测试的一些代码在内
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // 图片压缩
        new ImageminPlugin({
            disable: process.env.NODE_ENV !== 'production', // 开发时不启用
            pngquant: {//图片质量
                quality: '95-100'
            }
        }),
        new CopyWebpackPlugin([
            { from: path.resolve(__dirname, '../../static'), to: path.resolve(__dirname, '../../dist/live/static'), ignore: ['.*'] }
        ]),
        // new BundleAnalyzerPlugin({
        //     analyzerPort: 8889
        // })
    ]
});