import React, { Component, Fragment } from 'react';

import './button.less';
import { Message } from 'antd';

import { CourseApi } from '../../../../api/index';

import { computedEntryCourseTime, computedExpireDate, arrayFindTo, intlType } from '../../../../utils/common';
class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            host: ''
        };
    }

    componentDidMount () {
        this.setState({
            host: location.host
        });
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
     * 提交按钮
     */
    entryClassRoom = item => {
        let { host } = this.state;
        let { endTime, status, roomId, startTime } = item;
        // // 开课前15分钟进入
        if (!computedEntryCourseTime(15, startTime)) {
            Message.warning('开课前15分钟内进入');
            return;
        }
        // 未开课 且 课程已过结束时间
        if (status === 1 && !computedExpireDate(endTime)) {
            Message.warning('课程已过期');
            return;
        }
        let { userInfo: { loginToken }, studentInfo } = this.props;
        let { userId } = arrayFindTo(studentInfo, 'select', true);
        let params = {
            action: 'liveRoom',
            roomId,
            token: loginToken,
            subUserId: userId
        };
        CourseApi.sendLiveApi(params).then(res => {
            let { id, title, classType, startTime, endTime, status, teacher, broadcastingInfo, actualStartTime, platform, liveRoomWebUrl, videoUrl } = res.liveRoom;
            this.props.handleLoading(true);
            setTimeout(() => {
                this.props.handleLoading(false);
            }, 10000);
            //  直播平台 1 好未来-直播云，2 百家云
            if (platform === 2) {
                try {
                    if (status !== 3) {
                        liveClient_enterBjyLiveRoom(liveRoomWebUrl);
                    } else {
                        liveClient_enterBjyLiveRoom(videoUrl);
                    }
                } catch (error) {

                }
                return;
            }
            // 1 未开课 2 开课中 3 已结课 4 无效 5 已失效
            if (status === 1 || status === 2 || status === 3) {
                let params = {
                    // 1014
                    // 1075
                    institutionId: host.includes('preonlineh5') ? 1014 : 1075,
                    id: id,
                    title: title,
                    scenario: this.handleCourseBadge(classType, 'type'),
                    startTime: startTime,
                    endTime: endTime,
                    status: this.handleCourseBadge(status, 'courseStatus'),
                    // status: 1,
                    teacher_name: teacher.userName,
                    teacher_id: teacher.id,
                    /** 进入教室之后默认打开的课件地址
                     *  老师端必须配置，为进教室后默认打开的课件
                        学生端可以通过配置此参数，在开始上课前打开一个log页或欢迎页之类的
                     *  */
                    lesson_slide_url: broadcastingInfo.lessonSlideUrl ? broadcastingInfo.lessonSlideUrl : '',
                    // 课件备用地址
                    lesson_slide_backup_url: broadcastingInfo.lessonSlideBackupUrl ? broadcastingInfo.lessonSlideBackupUrl : '',
                    force_use_default_doc: status === 2 ? 0 : 1

                };

                // 当前是否已上过课 二次进入
                if (actualStartTime) {
                    params.actualStartTime = actualStartTime;
                }

                // 大班课班型特有字段，其它班型不传此参数
                if (classType === 3) {
                    // 是否连麦
                    params.needLianMai = 1;
                    params.record_mode = 4;
                }

                // 小班课传递 student字段
                if (classType === 2) {
                    params.students = [];
                    broadcastingInfo.students.forEach(students => {
                        params.students.push({
                            id: students.id,
                            name: students.userName,
                            avatar: students.avatar,
                        });
                    });
                }

                try {
                    let userInfoParam = {
                        userType: 'student',
                        token: loginToken,
                        subUserId: userId
                    };
                    liveClient_enterZbyLiveRoom(userInfoParam, params, item);
                } catch (error) {
                    console.error(error);
                }
            } else {
                this.setState({
                    isLoading: false
                });
                Message.warning(`该课程${'已失效'}`);
            }
        });


    }

    render () {
        return (
            <Fragment>
                {this.props.children}
            </Fragment>
        );
    }
}

export default Button;