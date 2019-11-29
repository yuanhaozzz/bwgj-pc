import React, { Component } from 'react';
import PropTypes from 'prop-types';


import './header.less';


class Header extends Component {
    static propTypes = {
        title: PropTypes.string
    }
    static defaultProps = {
        title: ''
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 返回按钮
     */
    handleBack = () => {
        history.back();
    }

    render () {
        let { title } = this.props;
        return (
            <div className='flex-center qa-common-header'>
                <img src='/live/static/images/live-home/qa-arrow.png' className='header-back-icon' onClick={this.handleBack} />
                <h1>{title}</h1>
            </div>
        );
    }
}

export default Header;