import React, { Component } from 'react';

import Message from '../../../common/message';
import StudentList from './studentList';
import { arrayFindTo, delCookie } from '../../../../utils/common';
import Sidebar from './sidebar.js';
import './header.less';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowSwitchAccount: false
        };
    }

    /**
    * 处理性别   // 1 男 2女
    */
    handleGender = (findSelect) => {
        if (findSelect.gender === 1) {
            return '/live/static/images/calandar/boy.png';
        } else if (findSelect.gender === 2) {
            return '/live/static/images/calandar/girl.png';
        }
        return '/live/static/images/calandar/child.png';
    }

    /**
     * 控制侧边栏展示
     */

    handleShowSidebar = () => {
        this.handleSidebar(true);
    }

    handleSidebar = () => {
        location.href = `/live/broadcast/center`;
    }

    /**
     * 打开退出登录弹窗
     */
    openMessage = () => {
        this.refs.message.handleOpen();
    }

    /**
     * 关闭退出登录弹窗
     */
    closeMessage = () => {
        this.refs.message.handleClose();
        // delCookie('userInfo');
        // setTimeout(() => {
        //     location.href = `/live/broadcast/login?clientType=1&userType=student`;
        // }, 300);
    }

    /**
     * 退出登录
     */
    handleLogout = () => {
        this.refs.message.handleClose();
        delCookie('userInfo');
        setTimeout(() => {
            location.href = `/live/broadcast/login?clientType=1&userType=student`;
        }, 300);
    }

    /**
     * 切换账号
     */
    handleSwitchAccount = isShow => {
        this.setState({
            isShowSwitchAccount: isShow
        });
    }

    /**
     * 跳转日历
     */
    jumpToCalendar = () => {
        location.href = '/live/broadcast/student/calendar';
    }

    /**
     * 刷新按钮
     */
    handleRefresh = () => {
        location.reload();
    }

    render () {
        let findSelect = arrayFindTo(this.props.studentInfo, 'select', true);
        let { isShowSidebar, isShowSwitchAccount } = this.state;
        return (
            <div className='home-header-wrapper'>
                <div className='home-header-box'>
                    <div className='home-header-left'>
                        <div className='home-header-left-name'>{findSelect.userEnName || findSelect.userName}</div>
                        <div className='sidebar-avatar' onClick={this.handleShowSidebar} style={{ 'background': `url(${this.handleGender(findSelect)}) no-repeat` }}>
                        </div>
                    </div>
                    <div className='home-header-right'>
                        {/* 日历 */}
                        <img className='home-header-right-timetable' src='/live/static/images/live-home/timetable.png' onClick={this.jumpToCalendar} />
                        {/* 刷新 */}
                        <img className='home-header-right-timetable' src='/live/static/images/live-home/live-refresh.png' onClick={this.handleRefresh} />
                    </div>
                </div>
                {/* 侧边栏 */}
                <div className={`home-header-sidebar-container ${isShowSidebar ? 'show' : 'hide'}`} >
                    <Sidebar {...this.props} handleSwitchAccount={this.handleSwitchAccount} openMessage={this.openMessage} closeMessage={this.closeMessage} handleSidebar={this.handleSidebar}></Sidebar>
                </div>
                {/* 退出登录弹窗 */}
                <Message ref='message' title='退出登录' footer={
                    <div className='flex-around message-button-wrapper' >
                        <button className='message-button-select' onClick={this.closeMessage}>取消</button>
                        <button className='message-button-unselect' onClick={this.handleLogout}>确认</button>
                    </div>
                }>
                    确认退出账号？
                </Message>
                {/* 切换学生 */}
                {
                    isShowSwitchAccount && <StudentList handleSwitchAccount={this.handleSwitchAccount} {...this.props}></StudentList>
                }
            </div>
        );
    }
}

export default Header;