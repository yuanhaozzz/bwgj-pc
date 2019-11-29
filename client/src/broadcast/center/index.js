import './center.less';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setStudent, setUserInfo } from '../../../redux/actions';
import { arrayFindTo, delCookie } from '../../../utils/common';
import { CenterApi } from '../../../api';
import StudentList from '../../../components/page/broadcast/live-home/studentList';
import Message from '../../../components/common/message';

class Index extends Component {
    static getInintalProps = (store, cookie) => {
        let userInfo = JSON.parse(cookie.userInfo),
            studentInfo = {};
        if (userInfo.subUserInfoVoList.length > 0) {
            studentInfo = userInfo.subUserInfoVoList;
        } else {
            studentInfo = [userInfo];
        }

        // 写入store
        store.dispatch(setStudent({ studentInfo }));
        store.dispatch(setUserInfo({ userInfo }));
    };

    constructor(props) {
        super(props);
        this.state = {
            currentVersion: '',
            studyData: '',
            activityNum: 0,
            gender: { 1: '男', 2: '女' },
            isShowSwitchAccount: false,
        };
    }

    componentDidMount () {
        this.getUserData();
        setTimeout(() => {
            try {
                this.setState({
                    currentVersion: liveClient_getDisplayVersion()
                });
            } catch (error) { }
        }, 300);
    }

    getUserData = () => {
        this.getStudyData();
        this.getActivity();
    }

    /* 
    * 获取用户学习统计
    */
    getStudyData = () => {
        const { userInfo, studentInfo } = this.props;
        const params = {
            action: 'getStudyCount',
            token: userInfo.loginToken,
            userId: studentInfo.find(item => item.select).userId,
        };
        CenterApi.getStudyCount(params).then(res => {
            this.setState({
                studyData: Object.keys(res.studyCount).length ? res.studyCount : { endingClassNum: 0, endingLessonTimeNum: 0 }
            });
        });
    }

    /* 
    * 获取用户参与活动
    */
    getActivity = () => {
        const { studentInfo } = this.props;
        CenterApi.getStatistics({
            student_id: studentInfo.find(item => item.select).userId
        }).then(res => {
            this.setState({
                activityNum: res.output,
            });
        });
    }

    /* 
        返回上级页面
    */
    back = () => {
        location.href = `/live/broadcast/home/1/student`;
    }

    /**
     * 切换账号
     */
    handleSwitchAccount = isShow => {
        if (!isShow) {
            this.getUserData();
        }
        this.setState({
            isShowSwitchAccount: isShow
        });
    }

    /**
     * 跳转设备测试
     */
    goDeviceTest = () => {
        location.href = '/live/broadcast/deviceTest';
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
    }

    /**
     * 退出登录
     */
    handleLogout = () => {
        this.refs.message.handleClose();
        delCookie('userInfo');
        location.href = `/live/broadcast/login?clientType=1&userType=student`;
    }

    /**
     * 跳转qa首页
     */
    goQaHome = () => {
        location.href = '/live/broadcast/qa/home?type=2';
    }
    render () {
        const { gender, studyData, activityNum, currentVersion, isShowSwitchAccount } = this.state;
        const studentInfo = arrayFindTo(this.props.studentInfo, 'select', true);
        return (
            <div className='flex-center report-layer'>
                <img className='personal-cente-back' src='/live/static/images/live-home/btn_back.png' onClick={() => this.back()} />
                <div className='personal-center'>
                    <div className='personal-center-header'>
                        <div className='personal-center-header-left'>
                            <div className='header-left-info'>
                                <div className='header-left-info-avatar'>
                                    <img src={studentInfo.imgUrl} />
                                </div>
                                <span className='header-left-info-name'>{studentInfo.userName || studentInfo.userEnName}</span>
                                <span className='header-left-info-button' onClick={() => this.handleSwitchAccount(true)}>切换账号</span>
                            </div>
                        </div>
                        <div className='personal-center-header-right'>
                            <div className='header-right-deviceTest' onClick={() => this.goDeviceTest()}>
                                <img src='/live/static/images/center/center-info-deviceTest.png' />
                            </div>
                            <div className='header-right-help' onClick={() => this.goQaHome()}>
                                <img src='/live/static/images/center/center-user-help.png' />
                            </div>
                        </div>
                    </div>
                    <div className='personal-center-user'>
                        <div className='personal-center-user-con user-info'>
                            <div className='user-img-module'>
                                <img src='/live/static/images/center/center-user-info.png' />
                            </div>
                            <div className='user-info-item'>
                                <div className='user-info-item-label'>姓名：</div>
                                <div className='user-info-item-data'>{studentInfo.userName}</div>
                            </div>
                            <div className='user-info-item'>
                                <div className='user-info-item-label'>英文名：</div>
                                <div className='user-info-item-data'>{studentInfo.userEnName}</div>
                            </div>
                            <div className='user-info-item'>
                                <div className='user-info-item-label'>性别：</div>
                                <div className='user-info-item-data'>{gender[studentInfo.gender] || '未知'}</div>
                            </div>
                            <div className='user-info-item'>
                                <div className='user-info-item-label'>生日：</div>
                                <div className='user-info-item-data'>{studentInfo.birthday}</div>
                            </div>
                            <div className='user-info-point'>如有修改，请联系班主任</div>
                        </div>
                        <div className='personal-center-user-con study-data'>
                            <div className='user-img-module'>
                                <img src='/live/static/images/center/center-study-data.png' />
                            </div>
                            <div className='study-data-item class'>
                                <div className='study-data-item-num class'>{studyData.endingClassNum}</div>
                                <div className='study-data-item-text'>我的班级</div>
                            </div>
                            <div className='study-data-item'>
                                <div className='study-data-item-num lesson'>{studyData.endingLessonTimeNum}</div>
                                <div className='study-data-item-text'>已完成课次</div>
                            </div>
                            <div className='study-data-item'>
                                <div className='study-data-item-num activity'>{activityNum}</div>
                                <div className='study-data-item-text'>已参与活动</div>
                            </div>
                        </div>
                    </div>
                    <div className='personal-center-footer'>
                        <div className='personal-center-footer-out' onClick={() => this.openMessage()}>退出登录</div>
                        {
                            currentVersion && <div className='personal-center-footer-version'>当前版本：V{currentVersion}</div>
                        }
                    </div>
                </div>
                {/* 退出登录弹窗 */}
                <Message ref='message' title='退出登录' footer={
                    <div className='flex-around message-button-wrapper' >
                        <button className='message-button-select' onClick={() => this.closeMessage()}>取消</button>
                        <button className='message-button-unselect' onClick={() => this.handleLogout()}>确认</button>
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

let mapStateToProps = state => {
    let { studentInfo } = state.course;
    let { userInfo } = state.login;
    return {
        userInfo,
        studentInfo,
    };
};

let Center = connect(
    mapStateToProps,
    { setStudent, setUserInfo }
)(Index);

export default Center;