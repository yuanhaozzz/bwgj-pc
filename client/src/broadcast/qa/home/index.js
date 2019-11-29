import React, { Component, Fragment } from 'react';

import HomeContent from '../../../../components/page/broadcast/qa/home/Content';
import Header from '../../../../components/page/broadcast/qa/common/Header';
import Search from '../../../../assets/images/live/search.png';
import { getHomeList } from '../../../../redux/actions';
import { queryUrlParams } from '../../../../utils/common';
import { connect } from 'react-redux';
import './home.less';

class Home extends Component {
    /**
    * @param {string} displayTerminal 1：老师端 2.学生和家长端
    */
    static getInintalProps (store, cookie, data) {
        let params = {
            action: 'getQAType',
            displayTerminal: data.type
        };
        return store.dispatch(getHomeList(params));

    }

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    /**
     * 跳转搜索页
     */
    jumpToH5 = () => {
        let { type } = queryUrlParams();
        location.href = `/live/broadcast/qa/search?type=${type}`;
    }



    /**
     * 首页搜索
     */
    renderSearch = () => {
        return (
            <div className='header-wrapper'>
                <Header title='用户帮助中心'></Header>
                <div className='header-search' style={{ 'background': `url(${Search}) no-repeat` }} onClick={this.jumpToH5}>输入你的问题或关键字</div>
            </div>
        );
    }

    /**
     * tab 及 列表
     */
    renderTabContent = () => {
        let { qaHomeList } = this.props;
        return (
            <Fragment>
                <HomeContent qaHomeList={qaHomeList}></HomeContent>
            </Fragment>
        );
    }

    render () {
        return (
            <div className='qa-wrapper'>
                <header>
                    {this.renderSearch()}
                </header>
                {/* tab选项内容 */}
                <section className='qa-bottom'>
                    {this.renderTabContent()}
                </section>
            </div>
        );
    }
}

let mapStateToProps = state => {
    let { qaHomeList } = state.qa;
    return {
        qaHomeList
    };
};

export default connect(
    mapStateToProps
)(Home);