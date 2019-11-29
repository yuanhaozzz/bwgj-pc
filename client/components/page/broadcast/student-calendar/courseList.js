import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message } from 'antd';

import './courseList.less';
import { format, computedEntryCourseTime, computedExpireDate, intlType, arrayFindTo } from '../../../../utils/common';
import Button from '../student-calendar/button';

class CourseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /**
     * 处理进入教室按钮状态
     * @param {any} item 当前循环对象
     */
    handleEntryClassStatus = item => {
        if (!computedEntryCourseTime(15, item.startTime)) {
            return 'disable';
        }
        // 获取时颜色展示
        if (item.status === 1 && !computedExpireDate(item.endTime)) {
            return 'disable';
        }
    }

    /**
     * 处理学习报告按钮状态
     * @param {any} item  当前循环对象
     */
    handleLearnStatus = item => {
        if (!item.showEvaluation) {
            return 'disable';
        }
    }


    /**
    * 进入教室
    */
    entryClassRoom = item => {
        this.refs.button.entryClassRoom(item);
    }

    /**
     * 映射表
     * @param {number} status	
     * @param {string} type
     */
    handleCourseBadge = (status, type) => {
        let { platform } = this.props;
        let defaultData = {
            // 直播间状态1 未开课 2 开课中 3 已结课 4 无效 5 已失效
            text: {
                '1': intlType(platform, 'course', 'waiting'),
                '2': intlType(platform, 'course', 'attending'),
                '3': intlType(platform, 'course', 'attended'),
                '4': intlType(platform, 'course', 'invalid'),
                '5': intlType(platform, 'course', 'expired'),
            },
            color: {
                '3': '#e2e2e2',
                '3': '#e2e2e2',
                '5': '#e2e2e2',
                '1': '#a6d4f5',
                '2': '#a6d4f5'
            },
            button: {
                '1': intlType(platform, 'course', 'enteringClass'),
                '2': intlType(platform, 'course', 'enteringClass'),
                '3': intlType(platform, 'course', 'viewPlayback'),
                '4': intlType(platform, 'course', 'invalid'),
                '5': intlType(platform, 'course', 'expired'),
            },
            // 设置班级映射关系   直播间类型    1 1v1，2 小班课，3 大班课，4 广播课
            type: {
                1: '0',
                2: '7',
                3: '2',
            },
            // 直播间状态1 未开课 2 开课中 3 已结课 4 无效 5 已失效
            courseStatus: {
                1: 1,
                2: 2,
                3: 3,
                4: -1,
                5: 4

            }
        };
        return defaultData[type][status];
    }

    /**
     * 查看学习报告
     */
    viewReport = item => {
        if (item.showEvaluation === 0) {
            Message.warning('老师暂未评价');
            return;
        }
        let { userId } = arrayFindTo(this.props.studentInfo, 'select', true);
        let { loginToken } = this.props.userInfo;
        location.href = `/live/broadcast/report?courseTitle=${encodeURIComponent(item.lessonTheme)}&liveRoomDetailId=${item.id}&userId=${userId}&token=${loginToken}`;
    }

    render () {
        let { courseRightList } = this.props;
        let courseList = courseRightList.courseList ? courseRightList.courseList : [];
        return (
            <div className='course-list-wrapper'>
                {/* 课程标题 */}
                <div className='course-list-top-bar flex-start'>
                    <div className='top-bar-verticle'></div>
                    <div className='margin-right-5'>{format(courseRightList.date, 'MM月dd日')}</div>
                    <div>共{courseList.length}节课</div>
                </div>
                {/* 判断当天是否有课 */}
                {
                    Object.keys(courseRightList).length === 0
                        ?
                        // 空展位图
                        <div className='course-right-list-empty-container flex-center'>
                            <img className='course-right-list-empty' src='/live/static/images/live-home/cadenlar_no_curriculum.png' />
                        </div>
                        :

                        <div className='course-list-container'>
                            {
                                courseList.map(item => (
                                    // 课程列表
                                    <div key={item.id} className='course-list-item'>
                                        {/* 是否缺课 */}
                                        {
                                            item.attendanceStatus === 1 && (
                                                <div className='calendar-course-missing-class'>
                                                    <img src='/live/static/images/calandar/course-missing-class.png' />
                                                </div>
                                            )
                                        }
                                        {/* title */}
                                        <div className='course-list-item-title'>{item.classNameCn}</div>
                                        {/* 课次 */}
                                        <div className='course-list-item-lesson'>
                                            <span>第{item.week}课次</span>
                                            <span>{item.lessonTheme}</span>
                                        </div>
                                        {
                                            item.status === 3 ?
                                                < div className='course-list-item-button'>
                                                    <button className='button-item button-item-playview' onClick={() => this.entryClassRoom(item)}>回放视频</button>
                                                    <Button ref='button' {...this.props}></Button>
                                                    <button onClick={() => this.viewReport(item)} className={`button-item button-item-learn ${this.handleLearnStatus(item)}`}>学习报告</button>
                                                </div>
                                                :
                                                <div className='course-list-item-button'>
                                                    <Button ref='button' {...this.props}>
                                                        <button onClick={() => this.entryClassRoom(item)} className={`button-item button-item-learn ${this.handleEntryClassStatus(item)}`}>进入教室</button>
                                                    </Button>

                                                </div>
                                        }
                                        <div className='course-list-item-time'>
                                            {format(+new Date(item.startTime), 'hh:mm')}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                }

            </div>
        );
    }
}

let mapStateToProps = state => {
    let { courseRightList } = state.course;
    return {
        courseRightList
    };
};

let connectRedux = connect(
    mapStateToProps,
    null
)(CourseList);

export default connectRedux;