import React, { Component } from 'react';

import { arrayFindTo } from '../../../../utils/common';
import './sidebar.less';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentVersion: ''
        };
    }

    componentDidMount () {
        setTimeout(() => {
            try {
                this.setState({
                    currentVersion: liveClient_getDisplayVersion()
                });
            } catch (error) {
            }

        }, 300);
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

    hideSidebar = e => {
        this.props.handleSidebar(false);
    }

    /**
     * 退出登录
     */
    handleLogout = () => {
        this.props.openMessage();

    }

    // /**
    //  * 切换账号
    //  */
    // handleAccount = () => {

    // }

    render () {
        let findSelect = arrayFindTo(this.props.studentInfo, 'select', true);
        let { currentVersion } = this.state;
        let { handleSwitchAccount } = this.props;
        return (
            <div className='sidebar-wrapper' onClick={this.hideSidebar}>
                <div className='sidebar-container' onClick={this.hideSidebar}>
                    {/* 头像 */}
                    <div className='sidebar-avatar sidebar-avatar-six' style={{ 'background': `url(${this.handleGender(findSelect)}) no-repeat` }}>
                    </div>
                    {/* 姓名 */}
                    <div className='sidebar-container-name'>{findSelect.userEnName || findSelect.userName}</div>
                    {/* 底部 */}
                    <div className='sidebar-bottom'>
                        <div className='sidebar-bottom-button sidebar-bottom-button-switch' onClick={() => handleSwitchAccount(true)}>切换账号</div>
                        <div className='sidebar-bottom-button sidebar-bottom-button-logout' onClick={this.handleLogout}>退出登录</div>
                        {
                            currentVersion && <p className='sidebar-bottom-version'>当前版本：V{currentVersion}</p>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;