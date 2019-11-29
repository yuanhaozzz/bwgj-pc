
import { SEND_COURSE_DETAIL, LOGIN, SHOW_DIALOG, SELECT_STUDENT, HIDE_DIALOG, TEST, COURSE_LIST, INTL, HOME_LIVE, HOME_CLASS, HOME_CLASS_COURSE, QA_TITLE, QA_HOME, QA_DETAIL } from './actionTypes';
import { CourseApi } from '../api/index';

// 课程信息
export function sendCourseDetail (courseRightList) {
    return {
        type: SEND_COURSE_DETAIL,
        payload: {
            ...courseRightList
        }
    };
}



// 设置用户信息
export function setUserInfo (userInfo) {
    return {
        type: LOGIN,
        payload: {
            ...userInfo
        }
    };
}

// 设置用户信息
export function setUserType (userType) {
    return {
        type: INTL,
        payload: {
            ...userType
        }
    };
}

// 显示弹窗
export function showDialog (status) {
    return {
        type: SHOW_DIALOG,
        payload: {
            ...status
        }
    };
}

// 隐藏弹窗
export function hideDialog (status) {
    return {
        type: HIDE_DIALOG,
        payload: {
            ...status
        }
    };
}

// 选中学生
export function setStudent (studentInfo) {
    return {
        type: SELECT_STUDENT,
        payload: {
            ...studentInfo
        }
    };
}

export function getCourseList (data) {
    return {
        type: COURSE_LIST,
        payload: {
            ...data
        }
    };
}

export function setClassCourseList (params) {
    return {
        type: HOME_CLASS_COURSE,
        payload: {
            ...params
        }
    };
}

export function getClassCourseList (params) {
    console.log(params);
    return dispatch => {
        return CourseApi.sendLiveApi(params).then(res => {
            dispatch(setClassCourseList({ homeClassCourseList: res.liveLessonList }));
        });
    };
}


export function awaitCourseList (params, next) {
    return (dispatch) => {
        return CourseApi.getList('calendar', params).then(res => {
            dispatch(getCourseList({ courseList: res['calendarList'] }));
        }).catch(err => {
            // next(err);
        });
    };
}



// 最近直播
export function getCurrentLive (params) {
    return new Promise(resolve => {
        return dispatch => {
            CourseApi.sendLiveApi(params).then(res => {
                dispatch(setCurrentLive({ homeLiveData: res.liveRoom }));
                resolve();
            });
        };
    });
}

// 最近直播
export function setCurrentLive (data) {
    return {
        type: 'HOME_LIVE',
        payload: {
            ...data
        }
    };
}
// 在学班级
export function getLearnClass (params) {
    return dispatch => {
        return CourseApi.sendBaseApi(params).then(res => {
            dispatch(setLearnClass({ homeLeranClass: res.classList }));
        });
    };

}

// 在学班级
export function setLearnClass (data) {
    return {
        type: 'HOME_CLASS',
        payload: {
            ...data
        }
    };
}

// QA
export function setQaDetailTitle (data) {
    return {
        type: QA_TITLE,
        payload: {
            ...data
        }
    };
}

export function getHomeList (params) {
    return dispatch => {
        return CourseApi.sendBaseApi(params).then(res => {
            console.log(res.questionTypeList);
            dispatch(setHomeList({ qaHomeList: res.questionTypeList }));
        });
    };
}
export function setHomeList (data) {
    return {
        type: QA_HOME,
        payload: {
            ...data
        }
    };
}

// qa 详情
// export function getQuestionDetail (params) {
//     let {id, title} = params
//     return dispatch => {
//         return CourseApi.sendBaseApi(params).then(res => {
//             console.log(res.questionTypeList);
//             dispatch(setQuestionDetail({ qaQuestionDetail: res.questionTypeList }));
//         });
//     };
// }
// export function setQuestionDetail (data) {
//     return {
//         type: QA_DETAIL,
//         payload: {
//             ...data
//         }
//     };
// }


// // 测试
// export function test () {
//     return dispatch => {
//         setTimeout(() => {

//         }, 1000);
//     }
// }

// 测试
export function test (list) {
    return {
        type: 'TEST',
        payload: {
            list
        }
    };
}

function testPromise (options) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([33, 33, 26662, 22]);
        }, 1000);
    });
}

export function testAsync () {
    return (dispatch, getState) => {
        return testPromise().then(res => {
            dispatch(test(res));
        });
    };
}

