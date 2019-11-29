// 去除样式文件等
require('ignore-styles');
// 将require
require('@babel/register')();
require('./server.js');