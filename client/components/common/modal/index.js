import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';

import './modal.less';


class modal extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            ModalText: 'Content of the modal',
            visible: false,
            confirmLoading: false,
            disable: false
        };
    }
    handleOk = () => {
        this.setState({
            confirmLoading: true,
        });
        this.props.handleSubmit();
    };

    closeLoadding = () => {
        this.setState({
            confirmLoading: false,
        });
    }

    closeModal = e => {
        this.setState({
            visible: false,
            confirmLoading: false,
        });
    }

    /**
     * 显示弹窗
     * @params {boolean} status true 禁用关闭
     */
    openModal = (status = false) => {
        this.setState({
            visible: true,
            disable: status
        });
    }

    handleCancel = () => {
        let { disable } = this.state;
        if (disable) {
            return false;
        }
        this.setState({
            visible: false,
        });
        this.props.handleCancel && this.props.handleCancel();
    };

    render () {
        const { visible, confirmLoading, disable } = this.state;
        let { title, children, successButtonText, modalType } = this.props;
        return (
            <div>
                <Modal
                    width={modalType && modalType === 'update' ? '500px' : '85%'}
                    title={title}
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    closable={!disable}
                    maskClosable={!disable}
                    cancelButtonProps=''
                    destroyOnClose
                    footer={
                        modalType && modalType === 'update' ?
                            (
                                <div className='modal-footer_update' key='update'>
                                    <span className='modal-cancel-button'>
                                        <Button className='student-cancel' onClick={this.handleCancel}>
                                            Cancel
                                        </Button>
                                    </span>
                                    <Button className='student-submit' loading={confirmLoading} onClick={this.handleOk}>
                                        {successButtonText ? successButtonText : 'ok'}
                                    </Button>
                                </div>
                            ) :
                            [
                                <span key='back' className='modal-cancel-button'>
                                    <Button onClick={this.handleCancel}>
                                        Cancel
                                    </Button>
                                </span>,
                                <Button key='submit' type='primary' loading={confirmLoading} onClick={this.handleOk}>
                                    {successButtonText ? successButtonText : 'ok'}
                                </Button>,
                            ]
                    }
                >
                    <div>{children}</div>
                </Modal>
            </div>
        );
    }
}

export default modal;