import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setQaDetailTitle } from '../../../../redux/actions';
import Header from '../../../../components/page/broadcast/qa/common/Header';

import './detail.less';
class Detail extends Component {

    static getInintalProps = (store, cookies, params) => {
        let { title } = params;
        return store.dispatch(setQaDetailTitle({ qaDetailTitle: title }));
    }

    constructor(props) {
        super(props);
        this.state = {
            htmlFragment: ''
        };
    }

    componentDidMount () {
        let htmlFragment = localStorage.getItem('answerDescription');
        this.setState({
            htmlFragment
        });
    }

    render () {
        let { htmlFragment } = this.state;
        let { qaDetailTitle } = this.props;
        return (
            <div className='detail-wrapper'>
                <Header title='帮助'></Header>
                <div className='detail-container'>
                    <div className='detail-title'>{qaDetailTitle}</div>
                    <div className='detail-content' dangerouslySetInnerHTML={{ __html: htmlFragment }}></div>
                </div>
            </div>
        );
    }
}

let mapStateToProps = state => {
    let { qaDetailTitle } = state.course;
    return {
        qaDetailTitle
    };
};

export default connect(
    mapStateToProps,
    { setQaDetailTitle }

)(Detail);