import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentLive, setStudent, setUserInfo, getLearnClass } from '../../../redux/actions';

import { CourseApi } from '../../../api';
import Header from '../../../components/page/broadcast/live-home/header';
import Live from '../../../components/page/broadcast/live-home/live';
import ClassLearn from '../../../components/page/broadcast/live-home/classLearn';
import Loadding from '../../../components/common/loadding';
import './live-home.less';

class Index extends Component {
    // 请求数据
    static getInintalProps (store, cookie) {
        let userInfo = JSON.parse(cookie.userInfo),
            studentInfo = {};

        // 用户个人信息 头像 名称展示
        if (userInfo.subUserInfoVoList.length > 0) {
            studentInfo = userInfo.subUserInfoVoList;
        } else {
            studentInfo = [userInfo];
        }
        let learn = {
            action: 'getLiveClass',
            userId: studentInfo.find(item => item.select).userId,
        };

        console.log(studentInfo.find(item => item.select).userId);

        // 写入用户信息
        store.dispatch(setUserInfo({ userInfo }));
        store.dispatch(setStudent({ studentInfo }));

        // 请求接口 
        return store.dispatch(getLearnClass(learn));
    }

    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            liveData: null,
            classData: null
        };
    }

    componentWillMount () {
        this.handleLoading(true);
        this.getLiveData();
        this.setTimer();
    }

    setTimer = () => {
        setTimeout(() => {
            this.getLiveData();
            this.setTimer();
        }, 10 * 1000);
    }

    /**
     * 获取最近直播数据
     */
    getLiveData = () => {
        let { userInfo, studentInfo } = this.props;
        let params = {
            action: 'liveRoom',
            token: userInfo.loginToken,
            subUserId: studentInfo.find(item => item.select).userId,
            queryType: 1
        };
        CourseApi.sendLiveApi(params).then(res => {
            this.setState({
                liveData: res.liveRoom
            });
            this.handleLoading(false);
        });
    }

    /**
     * 更新切换学生后请求数据
     */

    getLiveDataCopy = () => {
        let { userInfo, studentInfo } = this.props;
        let students = studentInfo.find(item => item.select);
        let { userId } = students;
        let params = {
            action: 'liveRoom',
            token: userInfo.loginToken,
            subUserId: userId,
            queryType: 1
        };
        CourseApi.sendLiveApi(params).then(res => {
            this.setState({
                liveData: res.liveRoom
            });
            let learn = {
                action: 'getLiveClass',
                userId,
            };

            this.props.getLearnClass(learn);
            this.handleLoading(false);
        });
    }

    /**
     * 控制loading显示隐藏
     * @param {string} isShow  是否显示
     */
    handleLoading = isShow => {
        this.setState({
            showLoading: isShow
        });
    }

    render () {
        let { homeLeranClass } = this.props;
        let { liveData, showLoading } = this.state;
        return (
            <div className='home-wrapper'>
                {/* 头部 */}
                <div className='home-header'>
                    <Header {...this.props} getLiveDataCopy={this.getLiveDataCopy}></Header>
                </div>
                <div className='home-content'>
                    <div className='home-content-box'>
                        {/* 最近直播 */}
                        {
                            liveData && <div className='home-content-live'>
                                <Live liveData={liveData} {...this.props} handleLoading={this.handleLoading}></Live>
                            </div>
                        }
                        <div className='home-content-class'>
                            <ClassLearn homeLeranClass={homeLeranClass}></ClassLearn>
                        </div>
                    </div>
                </div>
                {
                    showLoading && <Loadding></Loadding>
                }
            </div>
        );
    }
}

let mapStateToProps = state => {
    let { homeLiveData, homeLeranClass, studentInfo } = state.course;
    let { userInfo } = state.login;
    return {
        homeLiveData,
        homeLeranClass,
        userInfo,
        studentInfo
    };
};

let liveHome = connect(
    mapStateToProps,
    { getCurrentLive, getLearnClass, setStudent, setUserInfo }
)(Index);



export default liveHome;