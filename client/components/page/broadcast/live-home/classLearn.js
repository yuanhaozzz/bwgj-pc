import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ClassCard from './classCard';
import './classLearn.less';


class ClassLearn extends Component {

    static propTypes = {
        homeLeranClass: PropTypes.array
    }

    static defaultProps = {
        homeLeranClass: []
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 
     */
    jumpToClass = item => {
        let { classId, classNameCn } = item;
        location.href = `/live/broadcast/student/class/${classId}`;
    }

    render () {
        let { homeLeranClass } = this.props;
        return (
            <div className='home-class-wrapper'>
                <img className='home-live-img' src='/live/static/images/live-home/learing_class.png' />
                {
                    homeLeranClass.length > 0
                        ?
                        <div className='home-live-class flex-start'>
                            {

                                homeLeranClass.map(item => {
                                    return (
                                        <div key={item.classId} className='home-live-class-item' onClick={() => this.jumpToClass(item)}>
                                            <ClassCard classData={item}></ClassCard>
                                        </div>
                                    );
                                })
                            }

                        </div>
                        :
                        <div className='home-live-class-empty flex-center'>
                            <img src='/live/static/images/live-home/class_no_class.png' />
                        </div>
                }

            </div>
        );
    }
}

export default ClassLearn;