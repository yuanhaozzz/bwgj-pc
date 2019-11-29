
import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import { showDialog } from '../../../../redux/actions';
import { connect } from 'react-redux';
import { arrayFindTo, intlType } from '../../../../utils/common';
import './Sidebar.less';
class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleSignOut = () => {
        let { clientType } = this.props.match.params;
        let { platform } = this.props;
        if (clientType === '1') {
            window.location.href = '/live/broadcast/login?clientType=1&userType=' + platform;
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
        return (
            <aside className='sidebar-container'>
                <div className='sidebar-avatar' style={{ 'background': `url(${this.handleGender(findSelect)}) no-repeat` }}>
                </div>
                <div className='sidebar-name'>
                    {findSelect.userName}
                </div>
                <ul className='nav'>
                    <li className='nav-item'>
                        <Icon type='calendar' />
                        <div className='nav-item-title'>{intlType(platform, 'course', 'classSchedule')}</div>
                    </li>
                    {
                        platform === 'student' && <li className='nav-item' onClick={this.handleSwitchStudent}>
                            <Icon type='team' />
                            <div className='nav-item-title'>{intlType(platform, 'course', 'swtichStudent')}</div>
                        </li>
                    }
                    <li className='nav-item' onClick={this.handleSignOut}>
                        <Icon type='logout' />
                        <div className='nav-item-title'>{intlType(platform, 'course', 'signOut')}</div>
                    </li>
                </ul>

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