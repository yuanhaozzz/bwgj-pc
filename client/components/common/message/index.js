import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './message.less';

class Message extends Component {

    static propTypes = {
        footer: PropTypes.any
    }

    static defaultProps = {
        footer: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        };
    }

    handleClose = () => {
        this.setState({
            isShow: false
        });
    }

    handleOpen = () => {
        this.setState({
            isShow: true
        });
    }

    render () {
        let { footer, title, children } = this.props;
        let { isShow } = this.state;
        if (!isShow) {
            return <div></div>;
        }
        return (
            <div className='message-wrapper flex-center'>
                <div className='message-box'>
                    {
                        title && <div className='message-box-title'>{title}</div>
                    }
                    <p className='message-box-text'>{children}</p>
                    {

                        footer
                            ?
                            footer
                            :
                            <div className='flex-center message-button-wrapper' >
                                <button className='message-button-select' onClick={this.handleClose}>确认</button>
                            </div>
                    }


                </div>
            </div>
        );
    }
}

export default Message;