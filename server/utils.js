import { renderToString } from 'react-dom/server';
//重要是要用到StaticRouter
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
// 静态路由配置
import { renderRoutes } from 'react-router-config';
import routes from '../client/routes/config';
let fs = require('fs');

function asyncData () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([1]);
        }, 1000);
    });
}

export const render = (req, store) => {
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.path} >
                {
                    renderRoutes(routes)
                }
            </StaticRouter>
        </Provider>

    );
    return content;
};

export async function handleCommonResponse (req, res, store, matchedRoutes, params = {}) {
    let html = fs.readFileSync('dist/live/index.html', 'utf-8');
    // 请求对应组件的接口
    let loadData = '';
    matchedRoutes.forEach(routes => {
        if (routes.route.loadData) {
            loadData = routes.route.loadData;
        }
    });
    if (loadData) {
        await loadData(store, req.cookies, params);
    }
    // 插入服务器渲染字符串
    let renderHtml = html.replace('<!-- react-ssr -->', render(req, store)).replace('<!-- store -->', `
    <script>
        window._REACT_SOTRE = ${JSON.stringify(store.getState())}
    </script>
`);
    res.send(renderHtml);
}
