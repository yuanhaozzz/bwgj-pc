
import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import { showDialog } from '../../../../redux/actions';
import { connect } from 'react-redux';
import { arrayFindTo, intlType, delCookie } from '../../../../utils/common';
import './Sidebar.less';
class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentVersion: ''
        };
    }

    componentDidMount () {
        setTimeout(() => {
            let version = '';
            try {
                version = liveClient_getDisplayVersion();
            } catch (error) {
                version = '';
            }
            this.setState({
                currentVersion: version
            });
        }, 300);

    }

    handleSignOut = () => {
        let { clientType } = this.props.match.params;
        let { platform } = this.props;
        delCookie('userInfo');
        if (clientType === '1') {
            this.props.history.push(`/live/broadcast/login?clientType=${clientType}&userType=${platform}`);
        } else {
            window.WCRClassRoom.setUser('');
            this.props.history.push('/live/broadcast/login');
        }
    }

    handleSwitchStudent = () => {
        this.props.showDialog({ status: true });
    }

    handleAvatar = () => {

    }

    /**
     * 跳转帮助中心
     */
    goHelpHome = () => {
        location.href = '/live/broadcast/qa/home?type=1';
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

    render () {
        let findSelect = arrayFindTo(this.props.studentInfo, 'select', true);
        let { platform } = this.props;
        let { currentVersion } = this.state;
        return (
            <aside className='sidebar-container'>
                <div className='sidebar-avatar' style={{ 'background': `url(${this.handleGender(findSelect)}) no-repeat` }}>
                </div>
                <div className='sidebar-name'>
                    {findSelect.userEnName || decodeURIComponent(findSelect.userName)}
                </div>
                <ul className='nav'>
                    <li className='nav-item'>
                        <Icon type='calendar' />
                        <div className='nav-item-title'>Schedule </div>
                    </li>
                    {
                        platform === 'student' && <li className='nav-item' onClick={this.handleSwitchStudent}>
                            <Icon type='team' />
                            <div className='nav-item-title'>{intlType(platform, 'course', 'swtichStudent')}</div>
                        </li>
                    }
                    <li className='nav-item' onClick={this.goHelpHome}>
                        <Icon type='question-circle' />
                        <div className='nav-item-title'>User Guide</div>
                    </li>
                    <li className='nav-item' onClick={this.handleSignOut}>
                        <Icon type='logout' />
                        <div className='nav-item-title'>{intlType(platform, 'course', 'signOut')}</div>
                    </li>
                </ul>
                <div className='sidebar-version'>current version：{currentVersion}</div>
            </aside>
        );
    }

}
Sidebar.propTypes = {
    // eslint-disable-next-line react/require-default-props
    userInfo: PropTypes.object.isRequired
};

Sidebar.defaultProps = {
    userInfo: {}
};

let mapStateToProps = state => {
    let { studentInfo } = state.course;
    return {
        studentInfo
    };
};

export default connect(
    mapStateToProps,
    { showDialog }
)(Sidebar);