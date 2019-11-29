import React, { Component } from 'react';

import './classCourseTab.less';

class ClassCourseTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: ['全部', '已完成', '进行中', '待开始'],
            selectIndex: 0
        };
    }

    /**
     * 切换选项
     * @param {number} index  选中下标
     */
    switchTab = index => {
        this.setState({
            selectIndex: index
        });
        this.props.switchTab(index);

    }

    /**
    * 跳转日历
    */
    jumpToCalendar = () => {
        location.href = '/live/broadcast/student/calendar';
    }

    render () {
        let { tab, selectIndex } = this.state;
        return (
            <div className='class-course-tab-wrapper flex-space-between'>
                {/* 选项 */}
                <ul className='class-course-tab-box flex-start'>
                    {
                        tab.map((item, index) => (
                            <li className={`class-course-tab-item ${selectIndex === index && 'select'}`} key={index} onClick={() => this.switchTab(index)}>{item}</li>
                        ))
                    }
                </ul>
                {/* 课程表图标 */}
                <div className='class-course-tab-icon'>
                    {/* <img className='home-header-right-timetable' src='/live/static/images/live-home/timetable.png' onClick={this.jumpToCalendar} /> */}
                </div>
            </div >
        );
    }
}

export default ClassCourseTab;