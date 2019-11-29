// eslint-disable-next-line no-unused-vars
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Message, Spin } from 'antd';

import { format, arrayFindTo, intlType } from '../../../../utils/common';
import { CourseApi } from '../../../../api/index';
import './CourseList.less';

function CourseHeader () {
    return (
        <Fragment>
            <div className='course-header flex-center'>
                我的课程
            </div>
        </Fragment>
    );
}

class ListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfoParam: {},
            course: {},
            isLoading: false,
            host: ''
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
        let { clientType } = this.props.match.params;
        let { host } = this.state;
        this.setState({
            course: item
        });
        //  直播平台 1 好未来-直播云，2 百家云(自己客户端)
        if (item.platform === 2) {
            if (clientType === '1') {
                try {
                    enterBjyLiveRoomFun(item.liveRoomWebUrl);
                } catch (error) {

                }
            } else {
                location.href = item.liveRoomWebUrl;
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
                lesson_slide_url: item.broadcastingInfo.lessonSlideUrl,
                // 课件备用地址
                lesson_slide_backup_url: item.broadcastingInfo.lessonSlideBackupUrl,

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
            }, 5000);
            if (clientType === '1') {
                try {
                    localStorage.setItem('course', JSON.stringify(item));
                    enterZbyLiveRoomFun(this.state.userInfoParam, params, item);
                } catch (error) {

                }
            } else {
                // 进入教室  
                WCRClassRoom.joinClassRoom(JSON.stringify(params), (result) => {
                    // 回调函数
                    this.afterJoinClassroomCallback(result);
                });
            }

        } else {
            this.setState({
                isLoading: false
            });
            Message.warning(`该课程${'已失效'}`);
        }


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

    render () {
        let { courseData = {} } = this.props;
        let { isLoading } = this.state;
        if (Object.keys(courseData).length < 1) {
            return (
                <Fragment>
                    <div className='no-data'>暂无课程</div>
                </Fragment>
            );
        }
        return (
            <ul className='list-item hide-scroll'>
                {
                    isLoading && <Loadding></Loadding>
                }
                {
                    courseData.courseList.map((item) => (
                        <li key={item.id}>
                            <p className='list-item-title'>{item.title}</p>
                            <p className='list-item-type'>{this.handleScenario(item.classType)}&nbsp;&nbsp;{format(+new Date(item.startTime.replace(/-/g, '/')), 'hh:mm')}-{format(+new Date(item.endTime.replace(/-/g, '/')), 'hh:mm')}</p>
                            <p className='list-item-name'>{item.teacher.userName}</p>
                            <div className='list-item-status' style={{ backgroundColor: this.handleCourseBadge(item.status, 'color') }}>{this.handleCourseBadge(item.status, 'text')}</div>
                            <dir className='list-item-button'>
                                <button onClick={() => this.handleEntryClass(item)}>{this.handleCourseBadge(item.status, 'button')}</button>
                            </dir>
                        </li>
                    ))
                }
            </ul>
        );
    }
}

class CourseList extends Component {
    constructor(props) {
        super(props);
    }
    render () {
        let { courseData, userInfo, clearInterval } = this.props;
        return (
            <Fragment>
                <CourseHeader userInfo={userInfo}></CourseHeader>
                <ListItem userInfo={userInfo} clearInterval={clearInterval} {...this.props} courseData={courseData || {}}></ListItem>
            </Fragment>
        );
    }
}

class Loadding extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className='loadding-wrapper'>
                <Spin tip='Loading...'></Spin>
            </div>
        );
    }
}

let mapStateToProps = state => {
    let { courseData } = state.course;

    return {
        courseData
    };
};

export default connect(
    mapStateToProps,
    null
)(CourseList);