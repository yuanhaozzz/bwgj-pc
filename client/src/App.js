import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from '../route';
import { message } from 'antd';
import { createClientStore } from '../redux/store';
import { Provider } from 'react-redux';
import './App.less';
import '../assets/css/reset.less';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
// 

class App extends Component {
    componentDidMount () {
        message.config({
            top: 270,
            duration: 2,
            maxCount: 3,
        });
    }

    render () {
        return (
            // <ConfigProvider locale={zhCN}>
            <Provider store={createClientStore()}>
                <BrowserRouter>
                    <Router></Router>
                </BrowserRouter>
            </Provider>
            // </ConfigProvider>


        );
    }

}
export default App;