import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { format, arrayFind, arrayFindTo } from '../../../utils/common';
import { sendCourseDetail, setStudent, awaitCourseList, setUserInfo, setUserType } from '../../../redux/actions';
import SmallCaleandar from '../../../components/page/broadcast/teacher-course/SmallCaleandar';
import Sidebar from '../../../components/page/broadcast/teacher-course/Sidebar';
import Dialog from '../../../components/page/broadcast/teacher-course/Dialog';
import CourseList from '../../../components/page/broadcast/teacher-course/CourseList';
import { CourseApi } from '../../../api/index';
import './course.less';
/**
 * 计算开始年月日  和 结束年月日
 * @param {*} type 需要开始时间 还是结束时间
 */
function computedDate (date, type) {
    let nowDate = new Date(date);
    let month = nowDate.getMonth() + 1;
    let year = nowDate.getFullYear();
    let day = 20;
    if (type === 'startDate') {
        --month;
        if (month === 0) {
            month = 12;
            --year;
        }
    } else {
        ++month;
        day = 10;
        if (month === 13) {
            month = 1;
            ++year;
        }
    }
    return `${year}-${month < 10 ? '0' + month : month}-${day}`;
}


class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseData: [],
            currentDate: new Date(),
            interval: null,
            yearMonth: format(+new Date(), 'yyyy-MM'),
            changeDate: format(+new Date(), 'yyyy-MM-dd'),
            studentId: ''
        };
        // 用户个人信息 头像 名称展示
        if (this.props.userInfo.subUserInfoVoList.length > 0) {
            this.props.setStudent({ studentInfo: this.props.userInfo.subUserInfoVoList });
        } else {
            this.props.setStudent({ studentInfo: [this.props.userInfo] });
        }
    }

    componentWillMount () {
        // 判断数据是否存在  是否为服务端渲染字符串
        if (Object.keys(this.props.courseListStore).length > 0) {
            this.setState(state => {
                return {
                    courseData: this.props.courseListStore
                };
            });
            this.checkTodayCourse(+new Date(this.state.currentDate), this.props.courseListStore);
        } else {
            this.handleUserId();
        }
    }

    componentDidMount () {
        document.title = 'E PLUS Online';
    }

    // 清除自动请求定时器
    clearInterval = e => {
        this.setState(state => {
            clearTimeout(state.interval);
        });
    }

    /**
     * 处理userId
     */
    handleUserId = e => {
        if (this.props.userInfo.subUserInfoVoList.length > 0) {
            this.getCourseList(this.state.studentId || arrayFindTo(this.props.userInfo.subUserInfoVoList, 'select', true).userId);
        } else {
            this.getCourseList(this.props.userInfo.userId);
        }
    }

    /**
     * 选择日期时触发
     * @param {string} date  拼接的年月
     */
    changeDate = date => {
        let changeDate = `${date.year()}-${(date.month() + 1) < 10 ? '0' + (date.month() + 1) : date.month() + 1}-${date.date() < 10 ? '0' + date.date() : date.date()}`;
        let yearMonth = `${date.year()}-${(date.month() + 1) < 10 ? '0' + (date.month() + 1) : date.month() + 1}`;
        this.setState((state) => {
            state.currentDate = yearMonth;
            state.yearMonth = yearMonth;
            state.changeDate = changeDate;
            this.handleUserId();
        });

    }

    /**
    * 获取课程列表
    */
    getCourseList = (userId) => {
        let params = {
            action: 'liveCalendar',
            token: this.props.userInfo.loginToken,
            subUserId: userId,
            startDate: computedDate(this.state.yearMonth, 'startDate'),
            endDate: computedDate(this.state.yearMonth, 'endDate')
        };
        if (this.props.userInfo.subUserInfoVoList.length > 0) {
            params.subUserId = userId;
        }
        if (this.props.match) {
            let { clientType } = this.props.match.params;
            // 没有直播云 1 自己客户端  
            if (clientType === '1') {
                params.clientType = 1;
            }
        }

        CourseApi.getList('calendar', params).then(res => {
            res.calendarList.forEach(item => {
                item.courseList.forEach(test => {
                    test.evaluation = 0;
                });
            });
            this.setState({
                courseData: res.calendarList
            }, () => {
            });
            // 选中当天
            this.checkTodayCourse(+new Date(this.state.changeDate), this.state.courseData);
        });
    }

    /**
    * dialog 组件触发
    * 
    */
    handleDialogSwitchStudent = userId => {
        this.setState({
            studentId: userId
        });
        // this.getCourseList(userId);
    }

    /**
    * 检查当前日期是否有课
    * @param {number} nowDate 时间戳
    */
    checkTodayCourse = (nowDate, courseData) => {
        let today = format(nowDate, 'yyyy-MM-dd');
        this.props.sendCourseDetail({
            courseData: (arrayFind(courseData, 'date', today) || {})
        });

    }

    /**
     * 显示课程
     */
    showLesson = () => {
        let { courseDataStore } = this.props;
        let info = {
            lesson: 0,
            lessonLength: 0
        };
        if (Object.keys(courseDataStore).length < 1) {
            return info;
        }
        info.lesson = courseDataStore.courseList.length;
        info.lessonLength = courseDataStore.courseList.filter(item => (item.status !== 1 && item.status !== 2)).length;
        return info;
    }
    /**
     * 处理评价后 更新评价按钮状态
     */
    handleEvaluationStatus = (data, index) => {
        let { courseData } = this.state;
        let date = data.startTime.split(' ')[0] + ' 00:00:00';
        // console.log(date);
        let findData = courseData.map(item => {
            if (item.date === +new Date(date)) {
                item.courseList[index] = data;
                return item;
            }
            return item;

        });
        this.setState({
            courseData: findData
        }, () => {
            console.log(this.state.courseData);
        });
    }

    render () {
        let { userInfo, platform } = this.props;
        return (
            <Fragment>
                <div className='content-layout'>
                    {/* 侧边栏 个人信息 */}
                    <Sidebar userInfo={userInfo} {...this.props}></Sidebar>
                    <div className='content-layout-right flex-center'>
                        <div className='content-layout-right-box'>
                            <div className='content-layout-right-caleandar'>
                                <SmallCaleandar changeDate={this.changeDate} courseData={this.state.courseData}></SmallCaleandar>
                            </div>
                            <div className='content-layout-right-course'>
                                <CourseList handleEvaluationStatus={this.handleEvaluationStatus} clearInterval={this.clearInterval} userInfo={userInfo} courseData={this.state.courseData} platform={platform} userInfo={userInfo}></CourseList>
                            </div>
                        </div>
                        <div className='content-layout-right-carryout'>Lessons in total {this.showLesson().lesson} | Lessons finished {this.showLesson().lessonLength}</div>
                    </div>
                    <Dialog handleDialogSwitchStudent={this.handleDialogSwitchStudent} userInfo={userInfo}></Dialog>
                </div>
            </Fragment>
        );
    }
}

let mapStateToProps = state => {
    let { courseList, courseData } = state.course;
    let { userInfo, userType } = state.login;
    return {
        courseDataStore: courseData,
        courseListStore: courseList,
        userInfo,
        platform: userType
    };
};


let courseComponent = connect(
    mapStateToProps,
    { sendCourseDetail, setStudent, setUserInfo, awaitCourseList }
)(Course);

courseComponent.getInintalProps = (store, cookie, options) => {


    let userInfo = JSON.parse(cookie.userInfo),
        studentInfo = {};

    let { userType } = options;
    userInfo.select = true;
    if (userInfo.subUserInfoVoList.length > 0) {
        studentInfo = userInfo.subUserInfoVoList;
    } else {
        studentInfo = [userInfo];
    }

    let params = {
        action: 'liveCalendar',
        token: userInfo.loginToken,
        startDate: computedDate(new Date(), 'startDate'),
        endDate: computedDate(new Date(), 'endDate'),
        clientType: 1,
        subUserId: studentInfo.find(item => item.select).userId,
    };

    store.dispatch(setUserType({ userType }));
    // 写入store
    store.dispatch(setStudent({ studentInfo }));
    store.dispatch(setUserInfo({ userInfo }));

    return store.dispatch(awaitCourseList(params));

};

export default courseComponent;