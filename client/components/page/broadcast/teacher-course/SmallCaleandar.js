// eslint-disable-next-line no-unused-vars
import React, { Fragment, Component } from 'react';
// eslint-disable-next-line no-unused-vars
import { Calendar, Icon } from 'antd';
import { connect } from 'react-redux';

import { arrayFind, format } from '../../../../utils/common';
import { sendCourseDetail } from '../../../../redux/actions';
import './SmallCaleandar.less';

import Loadding from '../../../common/loadding';

let month = '';
class CalendarHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadding: false
        };
    }
    handleRefresh = () => {
        this.setState({
            loadding: true
        });
        location.href = location.pathname;
    }

    render () {
        let { loadding } = this.state;
        return (
            <div className='calendar-header flex-center'>
                <div className='calendar-header-refresh flex-center' onClick={this.handleRefresh}>
                    <Icon type='sync' style={{ fontSize: '18px', color: '#5fa2ee' }} />
                </div>
                <div className='flex-center margin-right-20'>
                    <div className='calendar-date-item'></div>
                    <p>To teach</p>
                </div>
                <div className='flex-center '>
                    <img src='/live/static/images/calandar/evaluation-error.png' className='calendar-date-image' />
                    <p>To comment</p>
                </div>
                {

                    loadding && <Loadding></Loadding>
                }
            </div>
        );
    }
}

class SmallCaleandar extends Component {
    constructor(props) {
        super(props);
    }
    /**
	 * 过滤出本月课程
	 * @param {string} value 
	 */
    filterMonthsCourse = value => {
        let currentCouse = [];
        this.props.courseData.forEach(item => {

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
            if (item.classType === 2 && item.showEvaluation === 1) {
                mark = 1;
            } else if (item.classType === 2 && item.showEvaluation === 2) {
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
        return (
            <div className='events '>
                <div className={`events-date ant-fullcalendar-value ${isToday && 'events-date-border'}`}>
                    {
                        date
                    }
                </div>
                {
                    filterDate.map(item => {
                        return (
                            <div key={item.date}>
                                {
                                    this.handleEvaluation(item) === 1 && <img src='/live/static/images/calandar/evaluation-error.png' className='events-date-image' />
                                }
                                <div className={`date-item`}></div>
                            </div>

                        );
                    })
                }

            </div >
        );
    }

    onSelect = date => {
        let monthDate = (date.month() + 1) < 10 ? '0' + (date.month() + 1) : (date.month() + 1);
        let clickDate = `${date.year()}-${monthDate}-${date.date() < 10 ? '0' + date.date() : date.date()}`;
        let findCourse = (arrayFind(this.props.courseData, 'date', clickDate) || {});
        if (month !== date.month()) return;
        this.props.sendCourseDetail({
            courseData: findCourse
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
            <Fragment>
                <CalendarHeader></CalendarHeader>
                <div className='calendar-wrapper'>
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
                                    <div className='flex-center'>
                                        <div className='calendar-caret flex-center' onClick={() => {
                                            let nowMonth = month;
                                            const newValue = value.clone();
                                            newValue.month(parseInt(--nowMonth, 10));
                                            onChange(newValue);
                                        }}>
                                            <Icon type='caret-left' style={{ fontSize: '20px', color: '#a9a9a9' }} />
                                        </div>
                                        <div className='calendar-date'>{`${year}/${((month + 1) > 9 ? (month + 1) : '0' + (month + 1))}`}</div>
                                        <div className='calendar-caret flex-center' onClick={() => {
                                            let nowMonth = month;
                                            const newValue = value.clone();
                                            newValue.month(parseInt(++nowMonth, 10));
                                            onChange(newValue);
                                        }}>
                                            <Icon type='caret-right' style={{ fontSize: '20px', color: '#a9a9a9' }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>

            </Fragment>
        );
    }
}

export default connect(
    null,
    { sendCourseDetail }
)(SmallCaleandar);