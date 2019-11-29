import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message } from 'antd';
import { format, computedEntryCourseTime, arrayFindTo, computedExpireDate, intlType } from '../../../../utils/common';
import './homeClassCourseList.less';
import Button from '../student-calendar/button';
class HomeClassCourseList extends Component {

    static propTypes = {
        classCourseData: PropTypes.object
    }

    static defaultProps = {
        classCourseData: {}
    }

    constructor(props) {
        super(props);
        this.state = {
        };
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

    handleYear = item => {
        let Timestamp = this.handleDate(item.startTime);
        return format(Timestamp, 'yyyy-MM-dd');
    }
    handleDate = (date) => {
        return new Date(date);
    }

    handleDay = item => {
        let Timestamp = this.handleDate(item.startTime);
        return format(Timestamp, 'hh:mm');
    }

    handleWeek = item => {
        let Timestamp = this.handleDate(item.startTime),
            day = Timestamp.getDate(),
            toDay = new Date().getDate(),
            week = '',
            weekday = Timestamp.getDay(),
            weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        if (toDay === day) {
            week = '今天';
        } else {
            week = weekList[weekday];
        }
        return week;
    }


    /**
     * 处理进入教室按钮状态
     * @param {any} item 当前循环对象
     */
    handleEntryClassStatus = item => {
        // 开课前15分钟不让进
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

    classStatus = inClassStatus => {
        let dom = null;
        if (inClassStatus === 0) {
            return dom = (
                <div className='course-class-status'>
                    <img src='/live/static/images/live-home/classRefund.png' />
                </div>
            );
        }
        if (inClassStatus === 4) {
            return dom = (
                <div className='course-class-status'>
                    <img src='/live/static/images/live-home/classUnbought.png' />
                </div>
            );
        }
        return dom;
    }

    render () {
        let { courseList } = this.props.classCourseData;
        return (
            <Fragment>
                {
                    courseList && courseList.length > 0 ? courseList.map(item => (
                        <div className='course-list-item' key={item.id}>
                            {/* 是否缺课 */}
                            {
                                item.attendanceStatus === 1 && (
                                    <div className='home-course-missing-class'>
                                        <img src='/live/static/images/calandar/course-missing-class.png' />
                                    </div>
                                )
                            }
                            {/* 未购买和退班 */}
                            {
                                this.classStatus(item.inClassStatus)
                            }
                            <div className='course-list-item-date'>{this.handleWeek(item)} {this.handleDay(item)} {this.handleYear(item)}</div>
                            <span className='course-list-item-week'>第{item.week}课次</span>
                            <span>{item.lessonTheme}</span>
                            <div className='course-list-button'>
                                {
                                    item.status === 3 ?
                                        <Fragment>
                                            <button className='course-list-button-item playview' onClick={() => this.entryClassRoom(item)}>回放视频</button>
                                            <Button ref='button' {...this.props}></Button>
                                            <button onClick={() => this.viewReport(item)} className={`course-list-button-item learn ${this.handleLearnStatus(item)}`}>学习报告</button>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Button ref='button' {...this.props}>
                                                <button onClick={() => this.entryClassRoom(item)} className={`course-list-button-item entry-class ${this.handleEntryClassStatus(item)}`}>进入教室</button>
                                            </Button>
                                        </Fragment>
                                }
                            </div>
                        </div>
                    ))
                        :
                        <div className='class-course-empty flex-center'>
                            <img src='/live/static/images/live-home/cadenlar_no_curriculum.png' />
                        </div>
                }

            </Fragment>
        );
    }
}

export default HomeClassCourseList;