import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CourseApi } from '../../../api/index';
import { sendCourseDetail, setStudent, awaitCourseList, setUserInfo, getCourseList } from '../../../redux/actions';
import Calendar from '../../../components/page/broadcast/student-calendar/calendar';
import CourseList from '../../../components/page/broadcast/student-calendar/courseList';
import { format } from '../../../utils/common';
import Loading from '../../../components/common/loadding';
import './student-calendar.less';

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

class Index extends Component {

    static getInintalProps = (store, cookie, options, next) => {
        let userInfo = JSON.parse(cookie.userInfo),
            studentInfo = {};
        if (userInfo.subUserInfoVoList.length > 0) {
            studentInfo = userInfo.subUserInfoVoList;
        } else {
            studentInfo = [userInfo];
        }
        let { userId } = studentInfo.find(item => item.select);
        let params = {
            action: 'liveCalendar',
            token: userInfo.loginToken,
            startDate: computedDate(new Date(), 'startDate'),
            endDate: computedDate(new Date(), 'endDate'),
            subUserId: userId,
            clientType: 1
        };
        console.log(userId, '=========================');


        // 写入store
        store.dispatch(setStudent({ studentInfo }));
        store.dispatch(setUserInfo({ userInfo }));

        return store.dispatch(awaitCourseList(params, next));
    };

    constructor(props) {
        super(props);
        this.state = {
            yearMonth: format(+new Date(), 'yyyy-MM'),
            changeDate: +new Date(format(+new Date(), 'yyyy-MM-dd')),
            showLoading: false
        };
    }

    componentWillMount () {
        // 判断数据是否存在  是否为服务端渲染字符串
        if (Object.keys(this.props.courseList).length > 0) {
            this.checkTodayCourse(+new Date(), this.props.courseList, format(+new Date(), 'yyyy-MM'));
        }
    }

    componentDidMount () {
        this.setTimer();
    }

    /**
     * 定时器
     */
    setTimer = () => {
        setTimeout(() => {
            let { studentInfo } = this.props;
            let currentStudent = studentInfo.find(item => item.select);
            this.getCourseList(currentStudent.userId, true);
            this.setTimer();
        }, 60 * 1000);
    }

    /**
   * 选择日期时触发
   * @param {string} date  拼接的年月
   */
    changeDate = date => {
        let changeDate = `${date.year()}-${(date.month() + 1) < 10 ? '0' + (date.month() + 1) : date.month() + 1}-${date.date() < 10 ? '0' + date.date() : date.date()}`;
        let yearMonth = `${date.year()}-${(date.month() + 1) < 10 ? '0' + (date.month() + 1) : date.month() + 1}`;
        this.setState({
            yearMonth,
            changeDate
        }, () => {
            this.handleUserId();
        });
    }


    /**
     * 处理userId
     */
    handleUserId = e => {
        let { studentInfo } = this.props;
        let currentStudent = studentInfo.find(item => item.select);
        this.getCourseList(currentStudent.userId);
    }

    /**
    * 获取课程列表
    */
    getCourseList = (userId, isTimer = false) => {
        let { yearMonth, changeDate } = this.state;
        let params = {
            action: 'liveCalendar',
            token: this.props.userInfo.loginToken,
            subUserId: userId,
            startDate: computedDate(yearMonth, 'startDate'),
            endDate: computedDate(yearMonth, 'endDate'),
            clientType: 1
        };
        CourseApi.getList('calendar', params).then(res => {
            this.setState({
                courseData: res.calendarList
            });
            this.props.getCourseList({ courseList: res['calendarList'] });
            if (!isTimer) {
                this.checkTodayCourse(+new Date(changeDate), res['calendarList'], yearMonth);
            }
        });
    }

    /**
   * 检查当前日期是否有课
   * @param {number} nowDate 时间戳
   * @param {any} courseList 课程列表
   * @param {string} yearMonth 年月  2017-01
   *    */
    checkTodayCourse = (nowDate, courseList, yearMonth) => {
        let today = format(nowDate, 'yyyy-MM-dd');
        // let nowDay = format(+new Date(), 'yyyy-MM-dd');
        let courseRightList = courseList.find(item => format(item.date, 'yyyy-MM-dd') === today) || {};
        // debugger;

        // if (!nowDay.includes(yearMonth)) {
        //     return;
        // }

        this.props.sendCourseDetail({
            courseRightList: Object.keys(courseRightList).length === 0 ? { date: +new Date(nowDate) } : courseRightList
        });
    }
    /**
     * 返回首页
     */
    jumpToCalendar = () => {
        location.href = '/live/broadcast/home/1/student';
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
        let { showLoading } = this.state;
        return (
            <div className='student-calendar-wrapper flex-center'>
                <img onClick={this.jumpToCalendar} className='student-calendar-back' src='/live/static/images/live-home/btn_back.png' />
                <div className='student-calendar-content'>
                    <p className='student-calendar-content-title'>课程表</p>
                    {/* 日历 */}
                    <div className='flex-start'>
                        <div className='student-calendar-content-calendar'>
                            <Calendar {...this.props} changeDate={this.changeDate}></Calendar>
                        </div>
                        <div className='student-calendar-content-list'>
                            <CourseList {...this.props} handleLoading={this.handleLoading}></CourseList>
                        </div>
                    </div>
                </div>
                {showLoading && <Loading></Loading>}
            </div>
        );
    }
}

let mapStateToProps = state => {
    let { courseList, studentInfo } = state.course;
    let { userInfo } = state.login;
    return {
        courseList,
        studentInfo,
        userInfo
    };
};

let connectRedux = connect(
    mapStateToProps,
    { sendCourseDetail, setStudent, setUserInfo, awaitCourseList, getCourseList }
)(Index);

export default connectRedux;