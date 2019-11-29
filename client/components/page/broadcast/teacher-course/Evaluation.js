import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Rate, Input, Card } from 'antd';
const { TextArea } = Input;
import './Evaluation.less';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
class Evaluation extends Component {

    static defaultProps = {
        data: {},
        evaluationStatus: 0
    }
    static propTypes = {
        data: PropTypes.object,
        evaluationStatus: PropTypes.number
    }
    constructor(props) {
        super(props);
        this.state = {
            evaluationData: this.props.data
        };
    }

    handleChangeStar = (star, evaluationData, index) => {
        let { evaluationStatus, data } = this.props;
        if (evaluationStatus === 2) {
            if (data.dimensionVoList[index].evaluationContent < star) {
                this.handleChange(star, evaluationData);
            } else {
                this.handleChange(data.dimensionVoList[index].evaluationContent, evaluationData);
                // Message.error('请大于之前选择的值');
            }
        } else {
            this.handleChange(star, evaluationData);
        }
    };
    handleChangeTextarea = (e, data) => {
        this.handleChange(e.target.value, data);
    }

    handleChange = (value, data) => {
        let { evaluationData } = this.state;
        data.evaluationContent = value + "";
        let copyEvaluationData = JSON.parse(JSON.stringify(evaluationData));
        // 操作总的数组
        copyEvaluationData.dimensionVoList.map(item => {
            if (item.dimensionValue === data.dimensionValue) {
                return data;
            }
            return item;

        });

        this.setState({
            evaluationData: copyEvaluationData
        });
    }

    render () {
        let { studentName, dimensionVoList } = this.state.evaluationData;
        const { value } = this.state;
        return (
            <div className='broadcast-evaluation-wrapper'>
                <Card title={studentName} extra={<p>Please rate</p>} style={{ width: '90%' }}>
                    {
                        dimensionVoList.map((item, index) => {
                            return (
                                <div key={index}>
                                    {
                                        item.dimensionType === 1
                                            ? <div className='evaluation-star flex-start'>
                                                <div className='evaluation-star-dimensionValue'>{item.dimensionValue}</div>
                                                <Rate tooltips={desc} allowClear={false} onChange={(e) => this.handleChangeStar(e, item, index)} value={parseInt(item.evaluationContent)} />
                                            </div>
                                            : <div className='evaluation-other-suggestions'>
                                                <div className='evaluation-suggestions-title'>Other suggestions</div>
                                                <TextArea
                                                    placeholder='no more than 800 words'
                                                    maxLength='800'
                                                    onChange={(e) => this.handleChangeTextarea(e, item)}
                                                    value={item.evaluationContent}
                                                    autosize={{ minRows: 5, maxRows: 8 }}
                                                />
                                            </div>
                                    }
                                </div>
                            );
                        })
                    }
                </Card>
            </div>
        );
    }
}

export default Evaluation;