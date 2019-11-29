// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';

import { format } from '../../../utils/common';
import { CourseApi } from '../../../api/index';

class CallbackZby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfoParam: {},
            course: {}
        };

    }

    componentDidMount () {
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1,
                        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        };

        window.WCRClassRoom && window.WCRClassRoom.setGlobalCallback(this.getClientInfo.bind(this));
    }
    getClientInfo (result) {
        this.getClientData().then(res => {
            let { userInfoParam, course } = res;
            this.afterJoinClassroomCallback(result, course, userInfoParam);

        });

    }

    getClientData = () => {
        return new Promise(resolve => {
            CourseApi.getCourseInfo().then(res => {
                let userInfoParam = res.liveUserInfo;
                let course = res.timeTableInfo;
                resolve({ userInfoParam, course });
            }).catch(err => {
            });
        });

    }

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
    afterJoinClassroomCallback = (content, course, userInfoParam) => {
        WCRClassRoom.web_log("globalCallback:" + JSON.stringify(content));
        // 调用客户端方法 获取到用户数据
        try {
            if (content["notify"] === "startClass") {
                WCRClassRoom.web_log(JSON.stringify(content));
                // 清除定时器
                console.log('点击上课按钮');
                if (userInfoParam.userType !== 'student') {
                    let params = {
                        action: 'callbackNotify',
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
                } else {
                    this.handleClientCallback({
                        status: 1,
                        lesson: course.id,
                        actual_time: '',
                        server_time: '',
                        notify: 'startClass'
                    });
                }
            } else if (content["notify"] === "endClass") {
                WCRClassRoom.web_log(JSON.stringify(content));
                console.log('点击下课按钮');
                if (userInfoParam.userType !== 'student') {
                    let params = {
                        action: 'callbackNotify',
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
                }

            } else if (content["notify"] === "enterClassRoom") {
                let notify = 'enterClassRoom';
                // 区分 进入/离开 记录
                if (course.status === 3) {
                    notify = 'replayEnterClassRoom';
                }
                WCRClassRoom.web_log(JSON.stringify(content));
                let params = {
                    action: 'callbackNotify',
                    token: userInfoParam.token,
                    subUserId: userInfoParam.subUserId,
                    notify,
                    data: JSON.stringify(content['body'])
                };
                CourseApi.sendStudioCallback('calendar', params).then(res => {
                }).catch(err => {
                    Message.warning(err);
                });

            } else if (content["notify"] === "leaveClassRoom") {
                WCRClassRoom.web_log(JSON.stringify(content));

                let notify = 'leaveClassRoom';
                // 区分 进入/离开 记录
                if (course.status === 3) {
                    notify = 'replayLeaveClassRoom';
                }
                let params = {
                    action: 'callbackNotify',
                    token: userInfoParam.token,
                    subUserId: userInfoParam.subUserId,
                    notify,
                    data: JSON.stringify(content['body'])
                };
                CourseApi.sendStudioCallback('calendar', params).then(res => {
                    setTimeout(() => {
                        window.webAdapter.reload();
                    }, 300);
                    console.log('离开教室');
                }).catch(err => {
                    Message.warning(err);
                    setTimeout(() => {
                        window.webAdapter.reload();
                    }, 300);
                });

            }
        } catch (error) {
        }

    }

    render () {
        return (
            <div>asd</div>
        );
    }
}

export default CallbackZby;