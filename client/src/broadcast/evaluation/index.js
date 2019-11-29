import React, { Component, Fragment } from 'react';
import { Message } from 'antd';

import Modal from '../../../components/common/modal';
import Evaluation from '../../../components/page/broadcast/teacher-course/Evaluation';
import { queryUrlValue } from '../../../utils/common';
import { CourseApi } from '../../../api/index';
class evaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platform: null,
            evaluationData: null,
            // 是否评价  1 评价  2 未评价
            evaluationStatus: '',
            liveRoomDetailId: '',
            token: '',
            userId: '',
        };
    }



    componentDidMount () {
        this.setState({
            evaluationStatus: +queryUrlValue().userId || 1,
            liveRoomDetailId: queryUrlValue().liveRoomDetailId || 0,
            token: queryUrlValue().key || '',
            userId: queryUrlValue().userId || '',
        }, () => {
            this.getEvaluation();
        });
    }

    getEvaluation = e => {
        let { liveRoomDetailId, token, userId } = this.state;
        let params = {
            action: 'getLiveEvaluation',
            liveRoomDetailId,
            key: token,
            userId,
        };
        CourseApi.sendLiveApi(params).then(res => {
            this.setState({
                evaluationData: res.getLiveEvaluationResult,
            }, () => {
                this.refs.modal.openModal();
            });
        });
    }

    /**
     * 验证 星星 评价语
     * @params {*} data 填写的所有信息
     */
    verificationData = data => {
        let mark = true;
        data.forEach(item => {
            item.dimensionVoList.forEach(item => {
                if (item.dimensionType === 1 && !item.evaluationContent) {
                    mark = false;
                }
            });
        });
        return mark;
    }

    handleSubmit = e => {
        let { liveRoomDetailId, token, userId, evaluationData } = this.state;
        // 获取评价组件内的数据

        let data = [];
        // 获取评价组件内的数据
        evaluationData.liveEvaluationDetailVoList.forEach((item, index) => {
            data.push(this.refs[`evaluation${index}`]['state']['evaluationData']);
        });
        let params = {
            action: 'saveLiveEvaluation',
            key: token,
            userId,
            evaluationDetail: {},
            templateType: evaluationData.templateType,
            liveRoomDetailId
        };
        data.forEach(item => {
            params['evaluationDetail'][item.studentId] = {};
            item.dimensionVoList.forEach(list => {
                params['evaluationDetail'][item.studentId][list.dimensionCode] = list.evaluationContent;
            });
        });
        if (!this.verificationData(data)) {
            Message.error('Please rate each item of the student');
            this.refs.modal.closeLoadding();
            return false;
        }

        params.evaluationDetail = JSON.stringify(params.evaluationDetail);
        CourseApi.sendLiveApi(params).then(res => {
            this.refs.modal.closeModal();
            window.close();
        }).catch(err => {
            this.refs.modal.closeLoadding();
        });
    }

    handleCancel = e => {
        window.close();
    }

    render () {
        let { evaluationData, evaluationStatus } = this.state;
        return (
            <div>
                {
                    evaluationData && <Modal title={evaluationData.classNameEn || ''} ref='modal' handleSubmit={this.handleSubmit} handleCancel={this.handleCancel}>
                        <div className='evaluation-container'>
                            {
                                evaluationData.liveEvaluationDetailVoList.map((item, index) => {
                                    // return <Evaluation ref='evaluation' data={item} key={index} evaluationStatus={evaluationStatus}></Evaluation>;
                                    return <Evaluation ref={`evaluation${index}`} data={item} key={index} evaluationStatus={evaluationStatus}></Evaluation>;
                                })
                            }
                        </div>
                    </Modal>
                }
            </div>
        );
    }
}

export default evaluation;