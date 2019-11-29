import { SEND_COURSE_DETAIL, SHOW_DIALOG, HIDE_DIALOG, SELECT_STUDENT, COURSE_LIST, HOME_LIVE, HOME_CLASS, HOME_CLASS_COURSE, QA_TITLE } from '../actionTypes';

// 定义store 状态
let initialState = {
    courseRightList: {},
    status: false,
    studentInfo: {},
    courseList: {},
    courseData: {},
    homeLiveData: {},
    homeLeranClass: {},
    homeClassCourseList: {},
    qaDetailTitle: ''
};

export default function (state = initialState, actions) {
    switch (actions.type) {
        case SEND_COURSE_DETAIL:
            let { payload } = actions;
            return {
                ...state,
                ...payload
            };
        case SHOW_DIALOG:
            return {
                ...state,
                ...actions.payload
            };
        case HIDE_DIALOG:
            return {
                ...state,
                ...actions.payload
            };
        case SELECT_STUDENT:
            return {
                ...state,
                ...actions.payload
            };
        case COURSE_LIST:
            return {
                ...state,
                ...actions.payload
            };
        case HOME_LIVE:
            return {
                ...state,
                ...actions.payload
            };
        case HOME_CLASS:
            return {
                ...state,
                ...actions.payload
            };
        case HOME_CLASS_COURSE:
            return {
                ...state,
                ...actions.payload
            };
        case QA_TITLE:
            return {
                ...state,
                ...actions.payload
            };
        default:
            return state;
    }
}