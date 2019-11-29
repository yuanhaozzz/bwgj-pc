import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { CourseApi } from '../../../api/index';
import { setStudent, setUserInfo, getClassCourseList } from '../../../redux/actions';
import Loading from '../../../components/common/loadding';
import ClassCourseTab from '../../../components/page/broadcast/class-course/classCourseTab';
import HomeClassCourseList from '../../../components/page/broadcast/class-course/homeClassCourseList';
import './classCourse.less';

class ClassCourse extends Component {

    static getInintalProps = (store, cookie, options, next) => {
        let userInfo = JSON.parse(cookie.userInfo),
            studentInfo = {},
            { classId } = options;
        // 给教师端默认添加选中
        userInfo.select = true;
        if (userInfo.subUserInfoVoList.length > 0) {
            studentInfo = userInfo.subUserInfoVoList;
        } else {
            studentInfo = [userInfo];
        }
        let params = {
            action: 'liveLesson',
            token: userInfo.loginToken,
            subUserId: studentInfo.find(item => item.select).userId,
            classId,
            status: '',
            pageIndex: 1,
            pageSize: 5
        };
        // 写入store
        store.dispatch(setStudent({ studentInfo }));
        store.dispatch(setUserInfo({ userInfo }));

        return store.dispatch(getClassCourseList(params, next));
    };

    constructor(props) {
        super(props);
        this.state = {
            isShowLoding: false,
            homeClassCourseList: [{ ...this.props.homeClassCourseList }, {}, {}, {}],
            tabIndex: 0,
            requestStatus: {
                0: '',
                1: 3,
                2: 2,
                3: 1
            },
            requestPage: [1, 1, 1, 1],
            timer: null
        };
    }

    componentDidMount () {
        this.watchScroll();
    }

    /**
     * 
     */
    watchScroll = () => {
        let scrollWrapper = document.querySelector('.class-course-content'),
            that = this;
        scrollWrapper.addEventListener('scroll', e => {
            // 可视区域高度
            let clientHeight = scrollWrapper.clientHeight,
                // 滚动元素高度
                scrollHeight = scrollWrapper.scrollHeight,
                { requestPage, tabIndex, timer, homeClassCourseList } = this.state;
            if (!homeClassCourseList[tabIndex].haveNextPage) {
                return false;
            }
            clearTimeout(timer);
            this.setState({
                timer: setTimeout(() => {
                    let { scrollTop } = scrollWrapper;
                    if (clientHeight + scrollTop >= scrollHeight - 100) {
                        requestPage[tabIndex]++;
                        that.setState({
                            requestPage
                        }, () => {
                            that.getClassCourseList(true);
                        });
                    }
                }, 300)
            });
        });
    }

    /**
     * 控制loading显示隐藏
     * @param {} state  状态
     */
    handleShowLoading (state) {
        this.setState({
            isShowLoding: state
        });
    }

    switchTab = tabIndex => {
        this.handleShowLoading(true);
        this.setState({
            tabIndex
        }, () => {
            let { tabIndex, homeClassCourseList } = this.state;
            if (homeClassCourseList[tabIndex].courseList && homeClassCourseList[tabIndex].courseList.length > 0) {
                this.handleShowLoading(false);
                return;
            }
            this.getClassCourseList();
        });
    }

    /**
     * 请求接口
     * @param {boolean} isLoadmore 是否为下拉加载
     */
    getClassCourseList = (isLoadmore = false) => {
        let { userInfo: { loginToken }, studentInfo, match: { params: { classId } } } = this.props,
            { tabIndex, requestStatus, requestPage, homeClassCourseList } = this.state;
        let params = {
            action: 'liveLesson',
            token: loginToken,
            subUserId: studentInfo.find(item => item.select).userId,
            classId,
            status: requestStatus[tabIndex],
            pageIndex: requestPage[tabIndex],
            pageSize: 5
        };
        CourseApi.sendLiveApi(params).then(res => {
            if (isLoadmore) {
                res.liveLessonList.courseList = [...homeClassCourseList[tabIndex].courseList, ...res.liveLessonList.courseList];
            }
            homeClassCourseList[tabIndex] = res.liveLessonList;
            this.setState({
                homeClassCourseList: homeClassCourseList
            }, () => {
                setTimeout(() => {
                    this.handleShowLoading(false);
                }, 300);
            });
        });
    }

    /**
     * 后退
     */
    jumpToCalendar = () => {
        location.href = '/live/broadcast/home/1/student';
    }


    render () {
        let { courseList } = this.props.homeClassCourseList;
        let { isShowLoding, homeClassCourseList, tabIndex } = this.state;
        return (
            <div className='flex-center report-layer'>
                <img onClick={this.jumpToCalendar} className='student-calendar-back' src='/live/static/images/live-home/btn_back.png' />
                <div className='report-wrapper'>
                    {/* 头标签 */}
                    <div className='report-header-img flex-center'>
                        {courseList && courseList.length > 0 && courseList[0].classNameCn}
                    </div>
                    <div className='home-class-course-wrapper'>
                        {/* tab */}
                        <section className='class-course-tab'>
                            <ClassCourseTab switchTab={this.switchTab}></ClassCourseTab>
                        </section>
                        {/* 课程列表 */}
                        <section className='class-course-content'>
                            {
                                homeClassCourseList.map((item, index) => (
                                    <Fragment key={index}>
                                        {
                                            tabIndex === index && <Fragment>
                                                <HomeClassCourseList handleLoading={this.handleShowLoading.bind(this)} classCourseData={item} {...this.props} handleShowLoading={this.handleShowLoading.bind(this)}></HomeClassCourseList>
                                                {
                                                    item.haveNextPage === 1 && <div className='loading-text'>正在加载更多数据</div>
                                                }
                                                {
                                                    !item.haveNextPage && item.courseList && item.courseList.length > 0 && <div className='loading-text'>已经全部加载完毕</div>
                                                }
                                            </Fragment>
                                        }
                                    </Fragment>

                                ))
                            }


                        </section>
                    </div>
                </div>
                {
                    isShowLoding && <Loading></Loading>
                }

            </div>
        );
    }
}

let matStateToProps = state => {
    let { homeClassCourseList, studentInfo } = state.course;
    let { userInfo } = state.login;
    return {
        homeClassCourseList,
        studentInfo,
        userInfo
    };
};

let connectRedux = connect(
    matStateToProps,
    { setStudent, setUserInfo, getClassCourseList }
)(ClassCourse);

export default connectRedux;