import React, { Component } from 'react';

import './calendar.less';
import { Calendar, Icon } from 'antd';
import { connect } from 'react-redux';

import { arrayFind, format } from '../../../../utils/common';
import { sendCourseDetail } from '../../../../redux/actions';
let month = '';
class SmallCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
   * 过滤出本月课程
   * @param {string} value 
   */
    filterMonthsCourse = value => {
        let currentCouse = [];
        this.props.courseList.forEach(item => {

            if (format(item.date, 'yyyy-MM-dd') === value) {
                currentCouse.push(item);
            }
        });
        return currentCouse;
    }

    handleEvaluation = list => {
        let mark = 0;
        if (Object.keys(list).length === 0) {
            mark = 0;
        }
        list.courseList.forEach(item => {
            if ((item.classType === 1 || item.classType === 2) && item.evaluation === 1) {
                mark = 1;
            } else {
                mark = 2;
            }
        });

        return mark;
    }

    dateCellRender = (value) => {
        let month = (value.month() + 1) < 10 ? '0' + (value.month() + 1) : value.month() + 1;
        let date = value.date() < 10 ? '0' + value.date() : value.date();
        let year = value.year();
        let filterDate = this.filterMonthsCourse(`${year}-${month}-${date}`);
        let toDay = format(new Date(), 'yyyy-MM-dd');
        let isToday = toDay === `${year}-${month}-${date}`;
        if (!year || !month || !date) {
            return false;
        }
        return (
            <ul className='events'>
                <div className={`events-date ant-fullcalendar-value ${isToday && 'events-date-background'}`}>
                    {
                        date
                    }
                </div>
                {
                    filterDate.map(item => {
                        return (
                            <div key={item.date}>
                                <div className={`date-item`}></div>
                            </div>
                        );
                    })
                }

            </ul>
        );
    }

    onSelect = date => {
        let monthDate = (date.month() + 1) < 10 ? '0' + (date.month() + 1) : (date.month() + 1);
        let clickDate = `${date.year()}-${monthDate}-${date.date() < 10 ? '0' + date.date() : date.date()}`;
        let findCourse = (arrayFind(this.props.courseList, 'date', clickDate) || {});
        if (month !== date.month()) return;
        this.props.sendCourseDetail({
            courseRightList: Object.keys(findCourse).length === 0 ? { date: +new Date(clickDate) } : findCourse
        });
    }

    /**
	 * 传递当前选择时间  从新获取时间的课程
	 * @param {object} date 时间对象
	 */
    onPanelChange = date => {
        // eslint-disable-next-line react/prop-types
        this.props.changeDate(date);
    }

    render () {
        return (
            <div className='student-calendar-container'>
                <div className='student-calendar'>
                    <Calendar
                        onPanelChange={this.onPanelChange}
                        onSelect={this.onSelect}
                        dateFullCellRender={this.dateCellRender}
                        fullscreen={false}
                        ref='myInput'
                        headerRender={({ value, onChange }) => {
                            month = value.month();
                            const year = value.year();
                            return (
                                <div style={{ padding: 10 }}>
                                    <div className='flex-space-between calendar-header-wrapper'>
                                        <div className='calendar-caret flex-center' onClick={() => {
                                            let nowMonth = month;
                                            const newValue = value.clone();
                                            newValue.month(parseInt(--nowMonth, 10));
                                            onChange(newValue);
                                        }}>
                                            <img src='/live/static/images/live-home/last_month.png' />
                                        </div>
                                        <div className='calendar-date'>{`${year}年${((month + 1) > 9 ? (month + 1) : '0' + (month + 1))}月`}</div>
                                        <div className='calendar-caret flex-center' onClick={() => {
                                            let nowMonth = month;
                                            const newValue = value.clone();
                                            newValue.month(parseInt(++nowMonth, 10));
                                            onChange(newValue);
                                        }}>
                                            <img src='/live/static/images/live-home/next_month.png' />
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {

    };
};

let connectRedux = connect(
    mapStateToProps,
    { sendCourseDetail }
)(SmallCalendar);

export default connectRedux;