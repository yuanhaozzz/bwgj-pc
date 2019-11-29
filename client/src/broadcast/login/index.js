
import React, { Component, Fragment } from 'react';
import { Form, Icon, Input, Button, message, Progress } from 'antd';
import { connect } from 'react-redux';

import Modal from '../../../components/common/modal';
import StudentList from '../../../components/page/broadcast/live-home/studentList';
import Message from '../../../components/common/message';
import { setUserInfo, setStudent, setUserType } from '../../../redux/actions';
import { UserApi } from '../../../api/index';
import { setCookie, setUuid, queryUrlParams, intlType, delCookie } from '../../../utils/common';
import './login.less';


class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            info: {}
        };
    }

    componentDidMount () {
        this.setState({
            info: JSON.parse(localStorage.getItem('info')) || {},
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                this.props.handleSubmit('account', {
                    loginName: value.username.trim(),
                    password: value.password.trim()
                });
            }
        });
    }

    switchMethod = e => {
        this.props.switchMethod(2);
    }

    handleForgetPassword = () => {
        this.refs.message.handleOpen();
    }

    handleCloseMessage = () => {
        this.refs.message.handleClose();
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { platform, loadding } = this.props;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className='login-form'>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            initialValue: this.state.info.loginName || '',
                            rules: [{ required: true, message: intlType(platform, 'login', 'userError') }],
                        })(
                            <Input
                                size='large'
                                placeholder={intlType(platform, 'login', 'user')}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            initialValue: this.state.info.password || '',
                            rules: [{ required: true, message: intlType(platform, 'login', 'passwordError') }],
                        })(
                            <Input
                                type='password'
                                size='large'
                                placeholder={intlType(platform, 'login', 'password')}
                            />,
                        )}
                    </Form.Item>


                    <Form.Item>
                        <Button type='primary' block htmlType='submit' style={{ "backgroundColor": "#E16DD8", "border": 'none', borderRadius: "100px" }} size='large' loading={loadding} className='login-form-button'>{intlType(platform, 'login', 'button')}</Button>
                    </Form.Item>
                </Form>
                <div className='flex-space-between'>
                    {
                        platform !== 'teacher' && <p className='login-form-password' onClick={this.handleForgetPassword}>忘记密码？</p>
                    }
                    {
                        platform !== 'teacher' && <p className='login-form-phone' onClick={this.switchMethod}>{intlType(platform, 'login', 'switchMobile')}</p>
                    }

                </div>
                <Message ref='message'>
                    请联系班主任老师修改密码
                </Message>
            </div>
        );
    }
}

class Phone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            info: {},
            isSend: false,
            number: 60,
            interval: null,
            phone: '',
            isShowSwitchAccount: false
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                this.props.handleSubmit('phone', {
                    mobile: value.phone,
                    smsCode: value.code,
                });
            }
        });
    }
    switchMethod = e => {
        this.props.switchMethod(1);
    }

    /**
     * 发送验证码
     */
    sendCode = e => {
        // 单个验证
        this.props.form.validateFields(['phone'], err => {
            if (!err) {
                this.setState(state => {
                    return {
                        isSend: true
                    };
                });
                let params = {
                    fromPlatform: 'ZB_CLIENT',
                    mobile: this.props.form.getFieldValue('phone'),
                    userSmsType: 0,
                    deviceType: 1,
                    deviceSerialNo: 'pc' + this.props.uuid,
                    action: 'sendUserSms'
                };
                UserApi.sendCode(params).then(res => {
                    this.setState({
                        interval: setInterval(() => {
                            this.setState((state, props) => {
                                return {
                                    number: --state.number
                                };
                            });
                            if (this.state.number === 0) {
                                this.setState(state => {
                                    clearInterval(this.state.interval);
                                    return {
                                        isSend: false,
                                        number: 60
                                    };
                                });
                            }

                        }, 1000)
                    });
                }).catch(err => {
                    this.setState(state => {
                        return {
                            isSend: false
                        };
                    });
                });
            }
        });


    }

    /**
     * 验证手机号码
     */
    validatorPhone = (rule, value, callback) => {
        const { platform } = this.props;
        let reg = /^1[3456789]\d{9}$/;
        if (!reg.test(value)) {
            callback(intlType(platform, 'login', 'verificationPhone'));
        }
        callback();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        const { platform, loadding } = this.props;
        let { isSend, number } = this.state;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className='login-form'>

                    <Form.Item>
                        {getFieldDecorator('phone', {
                            initialValue: this.state.phone || '',
                            rules: [
                                // { required: true, message: '请输入手机号!' },
                                { validator: (rule, value, callback) => this.validatorPhone(rule, value, callback) }
                            ],
                        })(
                            <Input
                                size='large'
                                placeholder={intlType(platform, 'login', 'phone')}
                            />,
                        )}

                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: intlType(platform, 'login', 'verificationCode') }],
                        })(
                            <div className='phone-box'>
                                <Input
                                    size='large'
                                    placeholder={intlType(platform, 'login', 'code')}
                                />
                                <button size='large' type='primary' onClick={this.sendCode} disabled={isSend} className='phne-code-button'>
                                    {
                                        isSend ? number + 's' : intlType(platform, 'login', 'send')
                                    }
                                </button>
                            </div>

                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' size='large' style={{ "backgroundColor": "rgb(224, 108, 215)", "border": 'none', borderRadius: '100px' }} block htmlType='submit' loading={loadding} className='login-form-button'>{intlType(platform, 'login', 'button')}</Button>
                    </Form.Item>
                </Form>
                <div className='flex-end'>
                    {
                        <p className='login-form-phone' onClick={this.switchMethod}>{intlType(platform, 'login', 'switchAccount')}</p>
                    }
                </div>
            </div>
        );
    }
}
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loginType: 1,
            info: {},
            uuid: '',
            platform: this.props.userType,
            versionData: {},
            userType: 'teacher',
            percent: 0,
            loadding: false,
            isShowSwitchAccount: false
        };
    }
    componentDidMount () {
        console.log(this.props);
        window.resizeTo(1180, 750);
        // 删除cookie
        delCookie('userInfo');
        this.setState({
            userType: queryUrlParams().userType,
        }, () => {
            let { userType } = this.state;
            if (userType === 'teacher') {
                document.title = 'E PLUS Online';
            } else {
                document.title = '北外壹佳在线';
            }
        });
        // this.callbackCheckNewVersion(JSON.stringify({needUpdate: true}));
        setTimeout(() => {
            try {
                liveClient_checkNewVersion(this.callbackCheckNewVersion);

            } catch (error) {

            }

        }, 300);

        this.setState({
            info: JSON.parse(localStorage.getItem('info')) || {},
            uuid: localStorage.getItem('uuid') ? localStorage.getItem('uuid') : setUuid()
        });
    }

    callbackCheckNewVersion = version => {
        version = JSON.parse(version);
        if (version.needUpdate) {
            this.refs.modal.openModal();
            this.setState({
                versionData: version
            });
        }
    }

    /**
     * 弹窗ok回调
     */
    handleModalSubmit = e => {
        liveClient_downloadUpdatePackageZip(this.handlePercent);
    }

    handlePercent = percent => {
        let { userType } = this.state;
        if (percent >= 1) {
            this.refs.modal.closeModal();
            message.success(userType === 'teacher' ? 'update completed' : '更新成功');
        }
        this.setState({
            percent: (percent * 100).toFixed(1)
        });
    }

    /**
     * 分为手机号 账号 登录  使用同一个方法
     * @param {string} loginType   (默认)account   phone
     */
    handleSubmit = (loginType = 'account', options = {}) => {
        this.props.form.validateFields((err) => {
            if (!err) {
                this.setState({
                    loadding: true
                });
                localStorage.setItem('uuid', this.state.uuid);
                let params = {
                    fromPlatform: 'ZB_CLIENT',
                    deviceType: 1,
                    deviceSerialNo: 'pc-' + this.state.uuid
                };


                let requestType = UserApi.getUserInfo;
                // 根据登录类型做区分
                if (loginType === 'account') {
                    params.loginName = options.loginName;
                    params.password = options.password;
                    params.action = 'loginWithPassword';
                } else {
                    params.mobile = options.mobile;
                    params.smsCode = options.smsCode;
                    requestType = UserApi.getPhoneUserInfo;
                    params.action = 'loginSms';
                }
                requestType(params).then((res) => {
                    // 判断是在直播云客户端 还是 自己客户端
                    let { platform } = this.state;
                    // 判断当前版本
                    if (res.userMessageVo.userType === 1 && platform === 'student') {
                        message.error('请登录教师端！');
                        this.setState({
                            loadding: false
                        });
                        return;
                    }
                    if (res.userMessageVo.userType !== 1 && platform === 'teacher') {
                        message.error('Please log in as a student');
                        this.setState({
                            loadding: false
                        });
                        return;
                    }
                    if (res.userMessageVo.userType === 4 && res.userMessageVo.subUserInfoVoList.length === 0) {
                        message.error(intlType(platform, 'login', 'noStudent'));
                        this.setState({
                            loadding: false
                        });
                        return;
                    }
                    this.setState({
                        loading: false
                    });
                    // 调用直播云SDK 传入父类信息
                    let userInfo = {};
                    // 如果子类存在 说明是 家长 或者 学生 取子类信息
                    if (res.userMessageVo.subUserInfoVoList.length > 0) {
                        userInfo.id = res.userMessageVo.subUserInfoVoList[0].userId;
                        userInfo.name = res.userMessageVo.subUserInfoVoList[0].userEnName || res.userMessageVo.subUserInfoVoList[0].userName;
                        userInfo.password = '0';
                        userInfo.token = res.userMessageVo.loginToken;
                        userInfo.avatar = 'http://snsimg.ztjystore.cn/ztnew/ad/img/2019/07/05/1562295571719403.png';
                        userInfo.mobile = res.userMessageVo.subUserInfoVoList[0].mobile || '0';
                        res.userMessageVo.subUserInfoVoList[0].select = true;
                        this.props.setStudent({ studentInfo: res.userMessageVo.subUserInfoVoList });
                    } else {
                        userInfo.id = res.userMessageVo.userId;
                        userInfo.name = res.userMessageVo.userEnName || res.userMessageVo.userName;
                        userInfo.password = '0';
                        userInfo.token = res.userMessageVo.loginToken;
                        userInfo.avatar = 'http://snsimg.ztjystore.cn/ztnew/ad/img/2019/07/05/1562295571719403.png';
                        userInfo.mobile = res.userMessageVo.mobile || '0';
                        this.props.setStudent({ studentInfo: [res.userMessageVo] });
                        res.userMessageVo.select = true;
                    }
                    console.log(this.props.studentInfo, '======');
                    // 1 教师，2 学员， 3 潜客 4 家长
                    let type = {
                        '1': 'teacher',
                        '2': 'student',
                        '3': 'student',
                        '4': 'student',
                    };
                    userInfo['type'] = type[(res.userMessageVo.userType)] || 'student';

                    // 写入store
                    this.props.setUserInfo({ userInfo: res.userMessageVo });

                    //  写入cookie
                    setCookie('userInfo', JSON.stringify(res.userMessageVo), 30);
                    localStorage.setItem('userInfo', JSON.stringify(res.userMessageVo));
                    // 记录登录的账号和密码
                    localStorage.setItem('info', JSON.stringify({
                        loginName: options.loginName,
                        password: options.password
                    }));


                    console.log(this.props);

                    try {
                        liveClient_login(userInfo);
                    } catch (error) {

                    }
                    if (platform === 'student') {
                        if (loginType !== 'account') {
                            this.setState({
                                isShowSwitchAccount: true
                            });
                            return;
                        }
                        location.href = `/live/broadcast/home/1/${platform}`;
                    } else {
                        location.href = `/live/broadcast/${platform}Course/1/${platform}`;
                    }

                }).catch(err => {
                    this.setState({
                        loadding: false
                    });
                });
            }
        });
    };
    /**
     * @param {number}  1切换到账号    2   切换到手机号
     */
    switchMethod = type => {
        this.setState({
            loginType: type
        });
    }

    /**
     * 切换账号
     */
    handleSwitchAccount = isShow => {
        this.setState({
            isShowSwitchAccount: isShow
        });
        location.href = `/live/broadcast/home/1/student`;
    }

    render () {
        let { loginType, platform, versionData, userType, percent, loadding, isShowSwitchAccount } = this.state;
        return (
            <Fragment>
                <div className='login-wrapper'>
                    <div className='login-wrapper-layout'>
                        <div className='login-logo'>
                            <p>{intlType(platform, 'login', 'platform')}</p>
                        </div>
                        {
                            loginType === 1 && <Account handleSubmit={this.handleSubmit} switchMethod={this.switchMethod} {...this.props} info={this.state.info} platform={platform} loadding={loadding}></Account>
                        }
                        {
                            loginType === 2 && <Phone handleSubmit={this.handleSubmit} uuid={this.state.uuid} switchMethod={this.switchMethod} {...this.props} platform={platform} loadding={loadding}></Phone>
                        }

                    </div>
                    <Modal
                        ref='modal'
                        modalType={'update'}
                        successButtonText={`${userType === 'teacher' ? 'Update' : 'ok'}`}
                        title={`${userType === 'teacher' ? 'Discover new version' : '发现新版本'}`}
                        handleSubmit={this.handleModalSubmit}>
                        <div dangerouslySetInnerHTML={{ __html: versionData.notes }}></div>
                        {
                            percent > 0 && <Progress percent={+percent} status='active' />
                        }

                    </Modal>
                    {/* 切换学生 */}
                    {
                        isShowSwitchAccount && <StudentList handleSwitchAccount={this.handleSwitchAccount} {...this.props}></StudentList>
                    }
                </div>

            </Fragment>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

let mapStateToProps = state => {
    let { studentInfo } = state.course;
    let { userType, userInfo } = state.login;
    return {
        userType,
        studentInfo,
        userInfo
    };
};

let loginComponent = connect(
    mapStateToProps,
    { setUserInfo, setStudent }
)(WrappedNormalLoginForm);

loginComponent.getInintalProps = (store, cookie, options) => {
    return new Promise((resolve, reject) => {
        let { userType } = options;
        store.dispatch(setUserType({ userType }));
        resolve();
    });
};

export default loginComponent;