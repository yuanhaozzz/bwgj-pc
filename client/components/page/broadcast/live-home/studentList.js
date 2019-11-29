import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setStudent } from '../../../../redux/actions';

import { setCookie, delCookie } from '../../../../utils/common';
import './studentList.less';

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdateStudentData: true,
            selectStudentInfo: {}
        };
    }

    /**
     * 切换学生
     * @params {any} item 当前对象
     */

    switchStudent = item => {
        let arr = [],
            { studentInfo } = this.props;
        if (item.select) {
            this.setState({
                isUpdateStudentData: false
            });
        }
        studentInfo.forEach(student => {
            student.select = false;
            if (student.userId === item.userId) {
                item.select = true;
            }
            arr.push(student);
        });
        this.setState({
            selectStudentInfo: item
        });
        let userInfo = JSON.parse(JSON.stringify(this.props.userInfo));
        userInfo.subUserInfoVoList = arr;
        setCookie('userInfo', JSON.stringify(userInfo), 30);
        this.props.setStudent({ studentInfo: arr });
    }

    /**
     * 学生确定按钮
     */

    handleSubmit = () => {
        let { isUpdateStudentData, selectStudentInfo } = this.state;
        let { handleSwitchAccount, getLiveDataCopy } = this.props;
        handleSwitchAccount(false);
        // 是否选中当前学生
        if (!isUpdateStudentData) {
            return;
        }
        //更新数据
        getLiveDataCopy && getLiveDataCopy(selectStudentInfo);
    }

    render () {
        let { studentInfo } = this.props;
        return (
            <div className='student-list-wrapper flex-center'>
                <div className='student-list-content'>
                    {/* 标题 */}
                    <div className='student-list-content-title'>请选择登录账号</div>
                    {/* 学生 */}
                    <div className='student-list-content-name flex-center'>
                        {
                            studentInfo.map(item => (
                                <div key={item.userId} className='student-list-item' onClick={() => this.switchStudent(item)}>
                                    {
                                        item.select && <img src='/live/static/images/live-home/student-select.png' />
                                    }
                                    <p>{item.userEnName || item.userName}</p>
                                </div>
                            ))
                        }
                    </div>
                    {/* 确定按钮 */}
                    <div className='student-list-content-button flex-center' onClick={this.handleSubmit}>确定</div>
                </div>
            </div>
        );
    }
}

let connectRedux = connect(
    null,
    { setStudent }
)(StudentList);


export default connectRedux;