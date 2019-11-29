import express from 'express';
import { createServerStore } from '../client/redux/store';
import { matchRoutes } from 'react-router-config';

import { handleCommonResponse } from './utils';
import routes from '../client/routes/config';

import { renderToString } from 'react-dom/server';
let fs = require('fs');
let path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();

const config = require('../build/client/webpack.client.dev');
const compiler = webpack(config);
var cookieParser = require('cookie-parser');

let dev = process.env.NODE_ENV === 'development';

if (dev) {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true,
        writeToDisk: true
    }));
    app.use(require("webpack-hot-middleware")(compiler));
}
app.use(cookieParser());
app.use(express.static('dist'));


/**
 * 课表页
 */
app.get('/live/broadcast/course/:clientType/:userType', async function (req, res) {
    // 同一个端 返回的实例一样
    let store = createServerStore();
    let { clientType, userType } = req.params;
    let params = {
        clientType,
        userType: userType || 'teacher'
    };
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});

app.get('/live/broadcast/studentCourse/:clientType/:userType', async function (req, res, next) {
    // 同一个端 返回的实例一样
    let store = createServerStore();
    let { clientType, userType } = req.params;
    let params = {
        clientType,
        userType: userType || 'teacher'
    };
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params, next);
});

app.get('/live/broadcast/teacherCourse/:clientType/:userType', async function (req, res) {
    // 同一个端 返回的实例一样
    let store = createServerStore();
    let { clientType, userType } = req.params;
    let params = {
        clientType,
        userType: userType || 'teacher'
    };
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});

app.get('/live/broadcast/home/:clientType/:userType', async function (req, res) {
    // 同一个端 返回的实例一样
    let store = createServerStore();
    let { clientType, userType } = req.params;
    let params = {
        clientType,
        userType: userType || 'teacher'
    };
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});

/**
 * 班级页面
 */
app.get('/live/broadcast/student/class/:classId', async function (req, res) {
    // 同一个端 返回的实例一样
    let store = createServerStore();
    let { classId } = req.params;
    let params = {
        classId
    };
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});

/**
 * 登录页
 */
//注意这里要换成*来匹配
app.get('/live/broadcast/login', async function (req, res) {
    let { clientType, userType } = req.query;
    let params = {
        clientType,
        userType: userType || 'teacher'
    };
    // 同一个端 返回的实例一样
    let store = createServerStore();
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    // 清楚cookie
    res.cookie('userInfo', '', { expires: new Date(Date.now() - 900000) });
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});


// qa 详情页
app.get('/live/broadcast/qa/detail', async function (req, res) {
    let { title, id } = req.query;
    let params = {
        title,
        id
    };
    // 同一个端 返回的实例一样
    let store = createServerStore();
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});

app.get('/live/broadcast/qa/home', async function (req, res) {
    let { type } = req.query;
    let params = {
        type
    };
    // 同一个端 返回的实例一样
    let store = createServerStore();
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes, params);
});

//注意这里要换成*来匹配
app.get('*', async function (req, res) {
    // 同一个端 返回的实例一样
    let store = createServerStore();
    // 返回匹配路由的数组。
    const matchedRoutes = matchRoutes(routes, req.path);
    await handleCommonResponse(req, res, store, matchedRoutes);
});


app.listen(3001, () => {
    console.log('listen:3001');
});