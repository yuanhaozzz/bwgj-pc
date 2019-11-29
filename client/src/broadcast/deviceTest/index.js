import './deviceTest.less';
import React, { Component } from "react";
import VideoTest from '../../../components/page/broadcast/deviceTest/videoTest';
import AudioTest from '../../../components/page/broadcast/deviceTest/audioTest';
import MikeTest from '../../../components/page/broadcast/deviceTest/mikeTest';

class deviceTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            macPower: true, // mac是否授权设备
            testStatus: 0, // 0:检测前（只mac显示）  1:检测中  2:检测完成
            testStage: 0, // 0:摄像头检测  1:扬声器检测  2:麦克风检测
            videoStatus: false, // 摄像头检测结果
            voiceStatus: false, // 扬声器检测结果
            mikeStatus: false, // 麦克风检测结果
            btnText: [
                { fail: '看不见', success: '看得见' },
                { fail: '听不见', success: '听得见' },
                { fail: '无波动', success: '有波动' },
            ],
            testModule: {
                0: <VideoTest />,
                1: <AudioTest />,
                2: <MikeTest />,
            },
            visible: false,
        };
    }

    componentDidMount() {
        if (navigator.platform.indexOf('Mac') !== -1) {
            navigator.getUserMedia = navigator.getUserMedia
                || navigator.webkitGetUserMedia
                || navigator.mozGetUserMedia;
            if (navigator.getUserMedia) {
                this.setState({
                    macPower: true,
                });
            } else {
                this.setState({
                    macPower: false,
                });
            }
        } else {
            this.setState({
                testStatus: 1,
            });
        }
    }

    testStart = () => {
        this.setState({
            testStatus: 1,
        });
    }

    /* 
        设备测试步骤
    */
    testBtn = (val) => {
        let { testStage } = this.state;
        switch (testStage) {
            case 0:
                this.setState({
                    testStage: 1,
                    videoStatus: val
                });
                break;
            case 1:
                this.setState({
                    testStage: 2,
                    voiceStatus: val
                });
                break;
            case 2:
                this.setState({
                    testStage: 3,
                    testStatus: 2,
                    mikeStatus: val
                });
                break;
            default:
                break;
        }
        
    }

    /* 
        再测一次
    */
    againTest = () => {
        this.setState({
            testStatus: 1,
            testStage: 0,
            videoStatus: false,
            voiceStatus: false,
            mikeStatus: false,
        });
    }

    /* 
        终止测试并返回上级页面
    */
    modalShow = (val) => {
        this.setState({
            visible: false,
        });
        if (val) {
            location.href = `/live/broadcast/center`;
        }
    }

    /* 
        返回上级页面
    */
    back = () => {
        const { testStatus } = this.state;
        if (testStatus === 1) {
            this.setState({
                visible: true,
            });
            return;
        }
        location.href = `/live/broadcast/center`;
    }

    /* 
    * 设备测检测步骤
    * 0:摄像头检测  1:扬声器检测  2:麦克风检测
    */
    deviceTeskMain = () => {
        const { testStatus, testStage, macPower, testModule, videoStatus, voiceStatus } = this.state;
        let dom = '';
        if (testStatus === 0) {
            dom = (
                <div className='device-test-mac'>
                    {
                        macPower
                            ? <img src='/live/static/images/deviceTest/deviceTest_mac_message.png' />
                            : <img src='/live/static/images/deviceTest/deviceTest_mac_operation.png' />
                    }
                </div>
            );
        }
        if (testStatus === 1) {
            dom = (
                <div className='device-test-main'>
                    <div className='device-test-stage'>
                        <div className='test-video'>
                            <div className='test-stage-img'>
                                <img style={testStage !== 0 ? {display: 'none'} : {display: 'block'}} src='/live/static/images/deviceTest/test_video_stage.png'/>
                                {
                                    testStage !== 0 && (
                                        videoStatus
                                            ? <img src='/live/static/images/deviceTest/test_success.png' />
                                            : <img src='/live/static/images/deviceTest/test_fail.png' />
                                    )
                                }
                            </div>
                        </div>
                        <div className={
                            [testStage === 0 && 'test-stage-line',
                                testStage !== 0 && (videoStatus ? 'test-stage-line line-success' : 'test-stage-line line-fail')].join(' ')
                        }></div>
                        <div className='test-voice'>
                            <div className='test-stage-img'>
                                <img style={testStage === 2 ? {display: 'none'} : {display: 'block'}} src='/live/static/images/deviceTest/test_voice_stage.png'/>
                                {
                                    testStage === 2 && (
                                        voiceStatus
                                            ? <img src='/live/static/images/deviceTest/test_success.png' />
                                            : <img src='/live/static/images/deviceTest/test_fail.png' />
                                    )
                                }
                            </div>
                        </div>
                        <div className={
                            [testStage !== 2 && 'test-stage-line',
                                testStage === 2 && (voiceStatus ? 'test-stage-line line-success' : 'test-stage-line line-fail')].join(' ')
                        }></div>
                        <div className='test-mike'>
                            <div className='test-stage-img'>
                                <img src='/live/static/images/deviceTest/test_mike_stage.png'/>
                            </div>
                        </div>
                    </div>
                    <div className='device-test-stage justify'>
                        <p className={[testStage === 0 && 'default', testStage !== 0 && (videoStatus ? 'default stage-success' : 'default stage-fail')].join(' ')}>摄像头</p>
                        <p className={[testStage !== 2 && 'default', testStage === 2 && (voiceStatus ? 'default stage-success' : 'default stage-fail')].join(' ')}>扬声器</p>
                        <p className='default'>麦克风</p>
                    </div>
                    {
                        testModule[testStage] || null
                    }
                </div>
            );
        }
        if (testStatus === 2) {
            dom = (
                <div className='device-test-result'>
                    {
                        this.testResultRender()
                    }
                </div>
            );
        }
        return dom;
    }

    /* 
    * 设备测检测结果展示
    */
    testResultRender = () => {
        let dom = '';
        const { videoStatus, voiceStatus, mikeStatus } = this.state;
        if (videoStatus && voiceStatus && mikeStatus) {
            dom = (
                <div className='test-result-success'>
                    <div className='test-success-img'>
                        <img src='/live/static/images/deviceTest/test_success-img.png' />
                    </div>
                    <div className='test-success-text'>
                        恭喜，设备检测成功，宝贝可以正常上课啦！<br />
                        开课前15分钟可以提前进入教室哦，记得上课不要迟到~
                    </div>
                </div>
            );
        } else {
            dom = (
                <div className='test-result-fail'>
                    <div className='fail-title'>很遗憾，设备检测未通过</div>
                    <div className='fali-problem'>
                        {
                            !videoStatus && (
                                <div className='fali-problem-item'>
                                    <div className='problem-item-title'>摄像头有问题</div>
                                    <div className='problem-item-method'>尝试在光线好的环境测试，如摄像头周边有异物请擦拭干净重新检测</div>
                                </div>
                            )
                        }
                        {
                            !voiceStatus && (
                                <div className='fali-problem-item'>
                                    <div className='problem-item-title'>扬声器有问题</div>
                                    <div className='problem-item-method'>尝试调高音量或关闭静音模式，如有连接耳机请断开重新检测</div>
                                </div>
                            )
                        }
                        {
                            !mikeStatus && (
                                <div className='fali-problem-item'>
                                    <div className='problem-item-title'>麦克风有问题</div>
                                    <div className='problem-item-method'>尝试靠近麦克风进行录制，如麦克风有异物堵塞请清理，如有外接麦克风请断开重新检测</div>
                                </div>
                            )
                        }
                        <div className='problem-item-require'>如有需要，请联系班主任</div>
                    </div>
                </div>
            );
        }
        return dom;
    }

    /* 
    * 设备测底部按钮展示
    */
    footerRender = () => {
        const { testStatus, testStage, btnText, videoStatus, voiceStatus, mikeStatus } = this.state;
        let dom = '';
        if (testStatus === 0) {
            dom = (
                <div className='task-start' onClick={() => this.testStart()}>开始测试</div>
            );
        }
        if (testStatus === 1) {
            dom = (
                <div className='task-conduct'>
                    <div className='task-fail' onClick={() => this.testBtn(false)}>{btnText[testStage].fail}</div>
                    <div className='task-success' onClick={() => this.testBtn(true)}>{btnText[testStage].success}</div>
                </div>
            );
        }
        if (testStatus === 2) {
            if (videoStatus && voiceStatus && mikeStatus) {
                dom = (
                    <div className='task-start' onClick={() => this.out()}>知道了</div>
                );
            } else {
                dom = (
                    <div className='task-conduct'>
                        <div className='task-fail' onClick={() => this.againTest()}>再测一次</div>
                        <div className='task-success' onClick={() => this.out()}>退出</div>
                    </div>
                );
            }
        }
        return dom;
    }

    render () {
        const { visible } = this.state;
        return (
            <div className='device-test'>
                <img className='device-test-back' src='/live/static/images/live-home/btn_back.png' onClick={() => this.back()}/>
                <div className='device-test-con'>
                    <div className='device-test-title'>设备测试</div>
                    {
                        this.deviceTeskMain()
                    }
                    <div className='device-test-footer'>
                        {
                            this.footerRender()
                        }
                    </div>
                </div>
                {
                    visible && (
                        <div className='device-test-modal'>
                            <div className='modal-box'>
                                <div className='modal-title'>确定要退出吗</div>
                                <div className='modal-con'>
                                    设备检测尚未完成，可能会影响上课效果
                                </div>
                                <div className='modal-footer'>
                                    <div className='modal-cancel' onClick={() => this.modalShow(false)}>取消</div>
                                    <div className='modal-ok' onClick={() => this.modalShow(true)}>确定</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default deviceTest;