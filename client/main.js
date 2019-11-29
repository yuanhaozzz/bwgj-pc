//client/index. js
import React from 'react';
import ReactDom from 'react-dom';
import App from './src/App';

// 服务端渲染使用的api 与render一样  只
ReactDom.hydrate(<App />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept();

}