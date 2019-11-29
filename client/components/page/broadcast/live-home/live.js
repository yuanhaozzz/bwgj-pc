import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { format, computedEntryCourseTime, computedExpireDate, intlType, arrayFindTo } from '../../../../utils/common';
import './live.less';
import Button from '../student-calendar/button';
class Live extends Component {

    static propTypes = {
        liveData: PropTypes.any
    }

    static defaultProps = {
        liveData: {}
    }

    constructor(props) {
        super(props);
        this.state = {
        };
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

    handleDate = (date) => {
        return new Date(date);
    }

    handleYear = item => {
        let Timestamp = this.handleDate(item.startTime);
        return format(Timestamp, 'yyyy-MM-dd');
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
        if (!computedEntryCourseTime(15, item.startTime)) {
            return 'disable';
        }
    }

    /**
    * 进入教室
    */
    entryClassRoom = item => {
        this.refs.button.entryClassRoom(item);
    }


    render () {
        let { liveData } = this.props;
        return (
            <div className='home-live-wrapper'>
                {/* 分类图片 */}
                <img className='home-live-img' src='/live/static/images/live-home/recent_live_broadcast.png' />
                {
                    liveData.teacher
                        ?
                        <div className='home-live-content'>
                            <div className='home-live-content-descript flex-start'>
                                <img className='home-live-content-icon' src='/live/static/images/live-home/class.png' />
                                <p>{liveData.title}</p>
                            </div>
                            <div className='home-live-content-descript flex-start'>
                                <img className='home-live-content-icon' src='/live/static/images/live-home/curriculum.png' />
                                <p>{liveData.weekName} {liveData.lessonTheme}</p>
                            </div>
                            <div className='home-live-content-descript flex-start'>
                                <img className='home-live-content-icon' src='/live/static/images/live-home/teacher.png' />
                                <p>授课老师：{liveData.teacher.userName}</p>
                            </div>
                            {/* 时间 */}
                            <div className='home-live-content-date'>{this.handleWeek(liveData)} {this.handleDay(liveData)} {this.handleYear(liveData)}</div>
                            {/*  */}
                            <Button ref='button' {...this.props}>
                                <div onClick={() => this.entryClassRoom(liveData)} className={`home-live-content-entry-class ${this.handleEntryClassStatus(liveData)}`}>进入教室</div>
                            </Button>
                        </div>
                        :
                        <div className='home-content-live-empty-box'>
                            <img className='home-content-live-empty' src='/live/static/images/live-home/class_no_curriculum.png' />
                        </div>
                }
                {/* 描述 */}

            </div>
        );
    }
}

export default Live;