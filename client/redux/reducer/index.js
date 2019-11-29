import { combineReducers } from 'redux';

import course from './course';
import login from './login';
import qa from './qa';

// 整个reducer
export default combineReducers({ course, login, qa });
