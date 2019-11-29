import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { setCookie } from '../../../../utils/common';

import { showDialog, hideDialog, setStudent } from '../../../../redux/actions';
// import { format } from '../../../../utils/common';
import './Dialog.less';

class Dialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            students: []
        };
    }

    componentDidMount () {
        let students = JSON.parse(localStorage.getItem('userInfo')).subUserInfoVoList;
        this.setState({
            students
        });
    }

    handleOk = e => {

    }

    /**
     * 点击学生信息后  将当前信息同步到当前学生 同时调用该学生的信息 去查找课表
     * 
     */
    handleStudentInfo = item => {
        if (!item.select) {
            this.props.handleDialogSwitchStudent(item.userId);
        }
        // 排他
        this.state.students.map(students => {
            students.select = false;
            if (item.userId === students.userId) {
                students.select = true;
            }
        });



        let userInfo = JSON.parse(JSON.stringify(this.props.userInfo));
        userInfo.subUserInfoVoList = JSON.parse(JSON.stringify(this.state.students));

        this.props.setStudent({ studentInfo: JSON.parse(JSON.stringify(this.state.students)) });
        //  写入cookie 和 localstorage
        setCookie('userInfo', JSON.stringify(userInfo), 30);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // 重新登录
        this.handleLogin(item);

        // 关闭弹窗
        this.props.hideDialog({ status: false });

    }

    /**
     * 处理切换学生后，重新登录
     */
    handleLogin = item => {
        window.WCRClassRoom.setUser('');
        let params = {
            id: item.userId,
            name: item.userName,
            password: '0',
            token: this.props.userInfo.loginToken,
            avatar: 'http://snsimg.ztjystore.cn/ztnew/ad/img/2019/07/05/1562295571719403.png',
            mobile: item.mobile || 0,
            type: 'student'
        };
        window.WCRClassRoom.setUser(params);
    }

    /**
     * 处理性别   // 1 男 2女
     */
    handleGender = (item) => {
        if (item.gender === 1) {
            return '/live/static/images/calandar/boy.png';
        } else if (item.gender === 2) {
            return '/live/static/images/calandar/girl.png';
        }
        return '/live/static/images/calandar/child.png';
    }

    handleCancel = e => {
        this.props.hideDialog({ status: false });
    }
    render () {
        // let { props } = props.userInfo
        return (
            <div>
                <Modal
                    visible={this.props.status}
                    title='切换学生'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width='50%'
                    footer={null}
                >
                    <div className='student'>
                        {
                            this.state.students.map((item, index) => {
                                return <div key={index} className='student-item' onClick={() => this.handleStudentInfo(item)}>
                                    <div className='student-item-avatar' style={{ 'background': `url(${this.handleGender(item)}) no-repeat` }}></div>
                                    <div className='student-item-name'>{item.userName}</div>
                                    {
                                        item.select && <div className='student-item-icon'>
                                            当前
                                        </div>
                                    }
                                </div>;
                            })
                        }
                    </div>

                </Modal >
            </div>
        );
    }
}

let mapStateToProps = state => {
    let { status } = state.course;
    return {
        status
    };
};

export default connect(
    mapStateToProps,
    { showDialog, hideDialog, setStudent }
)(Dialog);