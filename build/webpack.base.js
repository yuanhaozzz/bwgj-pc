let path = require('path');
// 抽取css为单个文件
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
// copy static目录到dist目录下

let webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            // '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../../client/assets/icon.js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                    },
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            //     javascriptEnabled: true,
                            //     modifyVars: {
                            //         'primary-color': 'red',
                            //    },
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: 'static/images/[name]-picf.[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [

        // 提供全局变量，这样不需要每次导入   import React from 'react'   等等！
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom',
            Component: ['react', 'Component'] // 导出react模块中的Component
        })
    ]
};