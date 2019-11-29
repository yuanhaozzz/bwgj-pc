// eslint-disable-next-line no-unused-vars
import React, { Fragment, Component } from 'react';
// eslint-disable-next-line no-unused-vars
import { Calendar, Icon } from 'antd';
import { connect } from 'react-redux';

import { arrayFind, format } from '../../../../utils/common';
import { sendCourseDetail } from '../../../../redux/actions';
import './SmallCaleandar.less';
let month = '';
function CalendarHeader () {

    function handleRefresh () {
        location.reload();
    }

    return (
        <div className='calendar-header flex-center'>
            <div className='calendar-header-refresh flex-center' onClick={handleRefresh}>
                <Icon type='sync' style={{ fontSize: '18px', color: '#5fa2ee' }} />
            </div>

        </div>
    );
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

    dateCellRender = (value) => {
        let month = (value.month() + 1) < 10 ? '0' + (value.month() + 1) : value.month() + 1;
        let date = value.date() < 10 ? '0' + value.date() : value.date();
        let year = value.year();
        let filterDate = this.filterMonthsCourse(`${year}-${month}-${date}`);
        return (
            <ul className='events'>
                {
                    filterDate.map(item => {
                        return (
                            <div key={item.date} className={`date-item`}>

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
                        dateCellRender={this.dateCellRender}
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