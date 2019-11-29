import React, { Component } from 'react';
import { Rate, Input, Button, message } from 'antd';

const { TextArea } = Input;
import './Student.less';
class Student extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textArea: '',
            loading: false,
            starTeacher: 0,
            starCourse: 0,
            starBroadcast: 0
        };
    }

    changeTextArea = (e) => {
        this.setState({
            textArea: e.target.value
        });
    }

    handleSubmit = e => {
        if (this.state.starTeacher === 0 || this.state.starCourse === 0 || this.state.starBroadcast === 0) {
            message.warning('请对每一项进行打分，您的支持是我们最大的动力！');
            return;
        }
        let params = {
            starTeacher: this.state.starTeacher,
            starCourse: this.state.starCourse,
            starBroadcast: this.state.starBroadcast,
            textArea: this.state.textArea,
        };
        window.webAdapter.closeWindow();

    }
    /**
     * 点击星星
     *  */
    changeStarTeacher = star => {
        this.setState({
            starTeacher: star
        });
    }
    changeStarCourse = star => {
        this.setState({
            starCourse: star
        });
    }
    changeStarBroadcast = star => {
        this.setState({
            starBroadcast: star
        });
    }

    render () {
        return (
            <div className='student-wrapper'>
                <div className='student-header'>
                    课后评价
                </div>
                <section className='student-content'>
                    <ul className='student-content-box'>
                        {/* <li className='student-content-info'>
                            <div className='info-layout'>
                                <p>奖励数： 1</p>
                                <p>排名：1</p>
                                <p>课程名称：奥术大师</p>
                                <p>授课老师：额阿达是</p>
                            </div>
                            <div>上课时间：2019-09-09 09:12:12 ~ 2019-09-09 09:12:12</div>
                        </li> */}
                        <li className='student-content-star'>
                            <div>
                                老师能力：<Rate onChange={this.changeStarTeacher} />
                            </div>
                            <div>
                                课程内容：<Rate onChange={this.changeStarCourse} />
                            </div>
                            <div>
                                直播质量：<Rate onChange={this.changeStarBroadcast} />
                            </div>
                        </li>
                    </ul>
                    <div className='student-content-feedback'>建议反馈</div>
                    <TextArea placeholder='请在这里填写您遇到的问题或建议，您的支持是我们最大的动力' onChange={this.changeTextArea} value={this.state.textArea} autosize={{ minRows: 4, maxRows: 10 }}></TextArea>
                    <div className='student-content-submit'>
                        <Button type='primary' block size='large' loading={this.state.loading} onClick={this.handleSubmit}>
                            提交
                        </Button>
                    </div>
                </section>
            </div>
        );
    }
}

export default Student;