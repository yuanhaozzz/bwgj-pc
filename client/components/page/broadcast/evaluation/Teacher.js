import React, { Component } from 'react';
import { Input, Button } from 'antd';
import './Teacher.less';

function StudentItme (props) {
    let { student } = props;
    return (
        <ul>
            <li></li>
        </ul>
    );
}

class Teacher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            student: [],
            loading: false
        };
    }

    componentDidMount () {
        let student = [
            {
                id: 1,
                name: '张三',
                reward: '5',
            },
            {
                id: 5,
                name: '张四',
                reward: '10',
            },
            {
                id: 10,
                name: '张五',
                reward: '9',
            },
        ];
        // 排序 并且新增 字段
        student.sort((a, b) => +b.reward - +a.reward).map(item => item.input = '');
        this.setState({
            student
        });
    }

    /**
     * 处理老师对学生的评价
     */
    changeEvaluation = (e, item) => {
        let value = e.target.value;
        item.input = value;
    }

    /**
     * 处理点击
     */
    handleSubmit = e => {
        window.webAdapter.closeWindow();
    }
    render () {
        return (
            <div className='teacher'>
                <div className='teacher-header'>
                    课后评价
                </div>
                <div className='teacher-content'>
                    <ul className='teacher-content-table'>
                        <li>
                            <div className='table-sort flex-center'>排名</div>
                            <div className='table-name flex-center'>姓名</div>
                            <div className='table-reward flex-center'>奖励数</div>
                            <div className='table-evaluation flex-center'>老师评语</div>
                        </li>
                        {
                            this.state.student.map((item, index) => {
                                return (
                                    <li key={item.id}>
                                        <div className='table-sort flex-center'>{index + 1}</div>
                                        <div className='table-name flex-center'>{item.name}</div>
                                        <div className='table-reward flex-center'>{item.reward}</div>
                                        <div className='table-evaluation flex-center'><Input placeholder='请在这里输入您对学生的评价' onChange={e => {
                                            this.changeEvaluation(e, item);
                                        }} /></div>
                                    </li>
                                );
                            })
                        }
                    </ul>
                    <div className='teacher-content-submit'>
                        <Button type='primary' block size='large' loading={this.state.loading} onClick={this.handleSubmit}>
                            提交
                        </Button>
                    </div>
                    {/* <div>暂未开放</div> */}
                </div>

            </div >
        );
    }
}

export default Teacher;