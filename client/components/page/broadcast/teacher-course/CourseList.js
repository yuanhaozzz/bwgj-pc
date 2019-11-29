// eslint-disable-next-line no-unused-vars
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Message, Spin } from 'antd';

import Modal from '../../../common/modal';
import Evaluation from '../../../page/broadcast/teacher-course/Evaluation';
import Loadding from '../../../common/loadding';
import { format, arrayFindTo, intlType, computedEntryCourseTime, computedExpireDate } from '../../../../utils/common';
import { CourseApi } from '../../../../api/index';
import './CourseList.less';

function CourseHeader () {
    return (
        <Fragment>
            <div className='course-header flex-center'>
                My lessons
            </div>
        </Fragment>
    );
}

class ListItem extends Component {
    static propTypes = {
        courseData: PropTypes.object
    }
    static defaultProps = {
        courseData: {}
    }
    constructor(props) {
        super(props);
        console.log(this.props.courseData, '................................');
        this.state = {
            userInfoParam: {},
            course: {},
            isLoading: false,
            host: '',
            evaluationData: null,
            evaluationStatus: '',
            selectEvaluationIndex: 0,
            selectEvaluationData: {}
            // courseData: this.props.courseData
        };
    }

    componentDidMount () {
        // 用户信息
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let userInfoParam = {
            token: userInfo.loginToken
        };
        if (userInfo.subUserInfoVoList.length > 0) {
            userInfoParam.subUserId = arrayFindTo(userInfo.subUserInfoVoList, 'select', true).userId;
        } else {
            userInfoParam.subUserId = userInfo.userId;
        }
        this.setState({
            userInfoParam,
            host: location.host
        });
    }

    /**
     * 返回教室类型
     * @param {number | string} scenario 区分教室类型 0 1v1  7 小班课  2 大班课
     */
    handleScenario = (scenario) => {
        let { platform } = this.props;

        switch (scenario) {
            case 1:
                return intlType(platform, 'course', 'typeOne');
            case 2:
                return intlType(platform, 'course', 'typeSmallClass');
            case 3:
                return intlType(platform, 'course', 'typeLargeClass');
            case 4:
                return intlType(platform, 'course', 'typeBroadcastClass');
        }
    }

    /**
     * 映射表
     * @param {number} status	
     * @param {string} type
     */
    handleCourseBadge = (status, type) => {
        let { platform } = this.props;
        let defaultData = {
            // 直播间状态1 未开课 2 开课中 3 已结课 4 无效 5 已失效
            text: {
                '1': intlType(platform, 'course', 'waiting'),
                '2': intlType(platform, 'course', 'attending'),
                '3': intlType(platform, 'course', 'attended'),
                '4': intlType(platform, 'course', 'invalid'),
                '5': intlType(platform, 'course', 'expired'),
            },
            color: {
                '3': '#e2e2e2',
                '3': '#e2e2e2',
                '5': '#e2e2e2',
                '1': '#a6d4f5',
                '2': '#a6d4f5'
            },
            button: {
                '1': intlType(platform, 'course', 'enteringClass'),
                '2': intlType(platform, 'course', 'enteringClass'),
                '3': intlType(platform, 'course', 'viewPlayback'),
                '4': intlType(platform, 'course', 'invalid'),
                '5': intlType(platform, 'course', 'expired'),
            },
            // 设置班级映射关系   直播间类型    1 1v1，2 小班课，3 大班课，4 广播课
            type: {
                1: '0',
                2: '7',
                3: '2',
            },
            // 直播间状态1 未开课 2 开课中 3 已结课 4 无效 5 已失效
            courseStatus: {
                1: 1,
                2: 2,
                3: 3,
                4: -1,
                5: 4

            }
        };
        return defaultData[type][status];
    }

    /**
     * 点击进入教室 or 查看回放  
     * 直播间状态 1 未开课 2 开课中 3 已结课 4 无效 5 已失效
     * @param {*} item 当前课次集合
     */
    handleEntryClass = (item) => {
        let { host } = this.state;
        this.setState({
            course: item
        });
        if (!computedEntryCourseTime(15, item.startTime)) {
            Message.warning('enter within 15 min before class starts');
            return;
        }
        // 未开课 且 课程已过结束时间
        if (item.status === 1 && !computedExpireDate(item.endTime)) {
            Message.warning('expired');
            return;
        }
        let { userInfo: { loginToken }, studentInfo } = this.props;
        let { userId } = arrayFindTo(studentInfo, 'select', true);
        let params = {
            action: 'liveRoom',
            roomId: item.roomId,
            token: loginToken,
            subUserId: userId
        };
        CourseApi.sendLiveApi(params).then(res => {
            let item = res.liveRoom;
            //  直播平台 1 好未来-直播云，2 百家云(自己客户端)
            if (item.platform === 2) {
                this.setState({
                    isLoading: true
                });
                setTimeout(() => {
                    this.setState({
                        isLoading: false
                    });
                }, 15000);
                try {
                    if (item.status !== 3) {
                        liveClient_enterBjyLiveRoom(item.liveRoomWebUrl);
                    } else {
                        liveClient_enterBjyLiveRoom(item.videoUrl);
                    }
                } catch (error) {

                }
                return;
            }
            // 1 未开课 2 开课中 3 已结课 4 无效 5 已失效
            if (item.status === 1 || item.status === 2 || item.status === 3) {
                let params = {
                    // 1014
                    // 1075
                    institutionId: host.includes('preonlineh5') ? 1014 : 1075,
                    id: item.id,
                    title: item.title,
                    scenario: this.handleCourseBadge(item.classType, 'type'),
                    startTime: item.startTime,
                    endTime: item.endTime,
                    status: this.handleCourseBadge(item.status, 'courseStatus'),
                    // status: 1,
                    teacher_name: item.teacher.userName,
                    teacher_id: item.teacher.id,
                    /** 进入教室之后默认打开的课件地址
                     *  老师端必须配置，为进教室后默认打开的课件
                        学生端可以通过配置此参数，在开始上课前打开一个log页或欢迎页之类的
                     *  */
                    lesson_slide_url: item.broadcastingInfo.lessonSlideUrl ? item.broadcastingInfo.lessonSlideUrl : '',
                    // 课件备用地址
                    lesson_slide_backup_url: item.broadcastingInfo.lessonSlideBackupUrl ? item.broadcastingInfo.lessonSlideBackupUrl : '',
                    force_use_default_doc: item.status === 2 ? 0 : 1

                };

                // 当前是否已上过课 二次进入
                if (item.actualStartTime) {
                    params.actualStartTime = item.actualStartTime;
                }

                // 大班课班型特有字段，其它班型不传此参数
                if (item.classType === 3) {
                    // 是否连麦
                    params.needLianMai = 1;
                    params.record_mode = 4;
                }

                // 小班课传递 student字段
                if (item.classType === 2) {
                    params.students = [];
                    item.broadcastingInfo.students.forEach(students => {
                        params.students.push({
                            id: students.id,
                            name: students.userName,
                            avatar: students.avatar,
                        });
                    });
                }
                this.setState({
                    isLoading: true
                });
                setTimeout(() => {
                    this.setState({
                        isLoading: false
                    });
                }, 15000);
                try {
                    localStorage.setItem('course', JSON.stringify(item));
                    liveClient_enterZbyLiveRoom(this.state.userInfoParam, params, item);
                } catch (error) {

                }
            } else {
                this.setState({
                    isLoading: false
                });
                Message.warning(`该课程${'已失效'}`);
            }

        });




    }

    // function handleEntryClass (course, userInfoParam) {
    //     //页面加载完，需要设置一个回调，本页面通过此回调，接收客户端内的通知
    //     WCRClassRoom.setGlobalCallback(function (result) {
    //         afterJoinClassroomCallback(result, course, userInfoParam);
    //     });

    // }

    /**
     * 点击开始上课时间回调客户端
     * @param {object} options
     * options.status 调用自己服务端接口是否成功
     * options.lesson 课程id
     * options.actual_time 第一次上课时间
     * options.server_time 每次服务器响应时间
     * notify  调用客户端对应方法     startClass 点击上课    endClass  结束上课
     */
    handleClientCallback = (options = {}) => {
        let { status, lesson, actual_time, server_time, notify } = options;
        //以下是模拟commonNotifyCallback回调

        let params = {
            notify,
            body: {
                status
            }
        };

        // 点击上课按钮回调
        if (notify === 'startClass') {
            params["body"]['data'] = {
                //server_time - actual_time用来计算展示在进入教室后开始已经上课时长。
                lesson,
                actual_time,
                server_time
            };
        }

        // 点击下课按钮回调
        if (notify === 'endClass') {
            params["body"]['data'] = {
                lesson
            };
        }
        // 统一调用
        window.WCRClassRoom.commonNotifyCallback(0, params);

    }

    /**
     * 客户端回调js
     * @param {*} content.notify    客户端回调通知类型  
     * @param {*} content.body      客户端回调参数
     */
    afterJoinClassroomCallback = (content) => {
        let { userInfoParam, course } = this.state;
        if (content["notify"] === "startClass") {
            window.WCRClassRoom.web_log(JSON.stringify(content));

            // 清除定时器
            console.log('点击上课按钮');
            let params = {
                token: userInfoParam.token,
                subUserId: userInfoParam.subUserId,
                notify: 'startClass',
                data: JSON.stringify(content['body'])
            };
            CourseApi.sendStudioCallback('calendar', params).then(res => {
                this.handleClientCallback({
                    status: 1,
                    lesson: course.id,
                    actual_time: (course.actualStartTime ? format(course.actualStartTime, 'yyyy-MM-dd hh:mm:ss') : format(res.systemDate, 'yyyy-MM-dd hh:mm:ss')),
                    server_time: format(res.systemDate, 'yyyy-MM-dd hh:mm:ss'),
                    notify: 'startClass'
                });
            }).catch(err => {
                this.handleClientCallback({
                    status: 2,
                    lesson: course.id,
                    actual_time: (course.actualStartTime ? format(course.actualStartTime, 'yyyy-MM-dd hh:mm:ss') : format(res.systemDate, 'yyyy-MM-dd hh:mm:ss')),
                    server_time: format(res.systemDate, 'yyyy-MM-dd hh:mm:ss'),
                    notify: 'startClass'
                });
            });
        } else if (content["notify"] === "endClass") {
            WCRClassRoom.web_log(JSON.stringify(content));
            console.log('点击下课按钮');
            let params = {
                token: userInfoParam.token,
                subUserId: userInfoParam.subUserId,
                notify: 'endClass',
                data: JSON.stringify(content['body'])
            };
            CourseApi.sendStudioCallback('calendar', params).then(res => {
                this.handleClientCallback({
                    status: 1,
                    lesson: course.id,
                    notify: 'endClass'
                });
            }).catch(err => {
                this.handleClientCallback({
                    status: 2,
                    lesson: course.id,
                    notify: 'endClass'
                });
            });
        } else if (content["notify"] === "enterClassRoom") {

        } else if (content["notify"] === "leaveClassRoom") {
            WCRClassRoom.web_log(JSON.stringify(content));
            window.webAdapter.reload();
            console.log('离开教室');
        }
    }

    /**
     * 点击评价按钮
     * @params {*} courseData 当前课程数据
     * @params {*} status 是否评价  1 评价  2 未评价
     */
    handleEvaluation = (courseData, status, index) => {
        let { userInfoParam } = this.state,
            { subUserId, token } = userInfoParam;
        let params = {
            action: 'getLiveEvaluation',
            liveRoomDetailId: courseData.id,
            token,
            userId: subUserId
        };
        console.log(params);
        CourseApi.sendLiveApi(params).then(res => {
            this.setState({
                evaluationData: res.getLiveEvaluationResult,
                evaluationStatus: status,
                selectEvaluationIndex: index,
                selectEvaluationData: courseData
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

    /**
     * 提交评价
     */
    handleSubmit = e => {
        let { evaluationData, selectEvaluationIndex, selectEvaluationData } = this.state;
        let { userInfoParam } = this.state,
            { subUserId, token } = userInfoParam;
        let data = [];
        // 获取评价组件内的数据
        evaluationData.liveEvaluationDetailVoList.forEach((item, index) => {
            data.push(this.refs[`evaluation${index}`]['state']['evaluationData']);
        });
        console.log(data);
        // 处理提交数据
        let params = {
            action: 'saveLiveEvaluation',
            token,
            userId: subUserId,
            evaluationDetail: {},
            templateType: evaluationData.templateType,
            liveRoomDetailId: selectEvaluationData.id
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
        // 手动更新状态
        selectEvaluationData.showEvaluation = 2;
        // 前端更新数据
        this.props.handleEvaluationStatus(selectEvaluationData, selectEvaluationIndex);
        // 请求接口
        params.evaluationDetail = JSON.stringify(params.evaluationDetail);
        CourseApi.sendLiveApi(params).then(res => {
            this.refs.modal.closeModal();
        }).catch(err => {
            this.refs.modal.closeLoadding();
        });

    }

    render () {
        let { courseData = {} } = this.props;
        let { isLoading, evaluationData, evaluationStatus } = this.state;
        if (Object.keys(courseData).length < 1) {
            return (
                <Fragment>
                    <div className='no-data'>No courses</div>
                </Fragment>
            );
        }
        return (
            <ul className='list-item hide-scroll'>
                {
                    isLoading && <Loadding></Loadding>
                }
                {
                    courseData.courseList.map((item, index) => (
                        <li key={item.id} className='teacher-course-list-box'>
                            <p className='list-item-title'>{item.title}</p>
                            <p>{format(+new Date(item.startTime.replace(/-/g, '/')), 'hh:mm')}-{format(+new Date(item.endTime.replace(/-/g, '/')), 'hh:mm')}</p>
                            <p className='list-item-type'>{item.lessonTheme}</p>
                            {/* <p className='list-item-type'>{item.lessonTheme}</p> */}
                            <div className='list-item-status' style={{ backgroundColor: this.handleCourseBadge(item.status, 'color') }}>{this.handleCourseBadge(item.status, 'text')}</div>
                            <dir className='list-item-button'>
                                {/* // 查看回放 百家云 */}
                                {
                                    item.status === 3 && item.platform === 2 && item.playbackStatus === 5 && <button onClick={() => this.handleEntryClass(item)}>{this.handleCourseBadge(item.status, 'button')}</button>
                                }
                                {/* // 查看回放 直播云 */}
                                {
                                    item.status === 3 && item.platform === 1 && <button onClick={() => this.handleEntryClass(item)}>{this.handleCourseBadge(item.status, 'button')}</button>
                                }
                                {/* // 不是下课展示的按钮 */}
                                {
                                    item.status !== 3 && < button onClick={() => this.handleEntryClass(item)}>{this.handleCourseBadge(item.status, 'button')}</button>
                                }
                                {
                                    item.classType === 2 && item.status === 3 && item.showEvaluation !== 0 && <button className='button-evaluation' onClick={() => this.handleEvaluation(item, item.showEvaluation, index)}>{item.showEvaluation === 1 ? 'feedback' : 'Re-feedback'}</button>
                                }
                            </dir>
                        </li>
                    ))
                }
                {
                    evaluationData && <Modal title={evaluationData.classNameEn || ''} ref='modal' handleSubmit={this.handleSubmit}>
                        <div className='evaluation-container'>
                            {
                                evaluationData.liveEvaluationDetailVoList.map((item, index) => {
                                    return <Evaluation ref={`evaluation${index}`} data={item} key={index} evaluationStatus={evaluationStatus}></Evaluation>;
                                })
                            }
                        </div>
                    </Modal>
                }

            </ul>
        );
    }
}

class CourseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // courseData: this.props.courseData
        };
    }



    render () {
        let { userInfo, clearInterval, courseData } = this.props;
        // let { userInfo, clearInterval, courseData } = this.state;
        return (
            <Fragment>
                <CourseHeader userInfo={userInfo}></CourseHeader>
                <ListItem userInfo={userInfo} clearInterval={clearInterval} {...this.props} courseData={courseData}></ListItem>
            </Fragment>
        );
    }
}



let mapStateToProps = state => {
    let { courseData, studentInfo } = state.course;
    let { userInfo } = state.login;
    return {
        courseData,
        userInfo,
        studentInfo
    };
};

export default connect(
    mapStateToProps,
    null
)(CourseList);