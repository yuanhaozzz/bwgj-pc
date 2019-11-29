// import ImportComponent from '../component/common/ImportComponent'
// let HomeDynmic = ImportComponent(import('../src/Home'))
// let LoginDynmic = ImportComponent(import('../src/Login'))

import Login from '../src/broadcast/login';
import Course from '../src/broadcast/course';
import TeacherCourse from '../src/broadcast/teacher-course';
// import StudentCourse from '../src/broadcast/student-course';
import Evaluation from '../src/broadcast/evaluation';
import CallbackZby from '../src/broadcast/callback-zby';
import LiveHome from '../src/broadcast/live-home';
import Report from '../src/broadcast/report';
import DeviceTest from '../src/broadcast/deviceTest';
import StudentCalendar from '../src/broadcast/student-calendar';
import ClassCourse from '../src/broadcast/class-course';
import QaHome from '../src/broadcast/qa/home';
import QaSearch from '../src/broadcast/qa/search';
import QaDetail from '../src/broadcast/qa/detail';
import Center from '../src/broadcast/center';

export default [
    {
        path: '/live/broadcast/tms/evaluation',
        component: Evaluation,
        key: 'evaluation',
        exact: true,
    },
    {
        path: '/live',
        component: Login,
        exact: true,
        key: 'Home',
    },
    {
        path: '/live/broadcast/login',
        component: Login,
        key: 'login',
        exact: true,
        loadData: Login.getInintalProps
    },
    {
        path: '/live/broadcast/course/:clientType/:userType',
        component: Course,
        key: 'course',
        exact: true,
        loadData: Course.getInintalProps
    },
    {
        path: '/live/broadcast/teacherCourse/:clientType/:userType',
        component: TeacherCourse,
        key: 'TeacherCourse',
        exact: true,
        loadData: TeacherCourse.getInintalProps
    },
    // {
    //     path: '/live/broadcast/studentCourse/:clientType/:userType',
    //     // path: '/',
    //     component: StudentCourse,
    //     key: 'StudentCourse',
    //     exact: true,
    //     loadData: StudentCourse.getInintalProps
    // },
    {
        path: '/live/broadcast/callbackZby',
        component: CallbackZby,
        key: 'callbackZby',
        exact: true,
    },
    {
        path: '/live/broadcast/report',
        component: Report,
        key: 'Report',
        exact: true,
    },
    {
        path: '/live/broadcast/home/:clientType/:userType',
        component: LiveHome,
        key: 'LiveHome',
        exact: true,
        loadData: LiveHome.getInintalProps
    },
    {
        path: '/live/broadcast/student/calendar',
        component: StudentCalendar,
        key: 'StudentCalendar',
        exact: true,
        loadData: StudentCalendar.getInintalProps
    },
    {
        path: '/live/broadcast/student/class/:classId',
        component: ClassCourse,
        key: 'ClassCourse',
        exact: true,
        loadData: ClassCourse.getInintalProps
    },
    {
        path: '/live/broadcast/deviceTest',
        component: DeviceTest,
        key: 'deviceTest',
        exact: true,
    },
    {
        path: '/live/broadcast/qa/home',
        component: QaHome,
        key: 'QaHome',
        loadData: QaHome.getInintalProps
    },
    {
        path: '/live/broadcast/qa/search',
        component: QaSearch,
        key: 'QaSearch',
        loadData: QaSearch.getInintalProps
    },
    {
        path: '/live/broadcast/qa/detail',
        component: QaDetail,
        key: 'QaDetail',
        loadData: QaDetail.getInintalProps
    },
    {
        path: '/live/broadcast/center',
        component: Center,
        key: 'center',
        exact: true,
        loadData: Center.getInintalProps
    }

];