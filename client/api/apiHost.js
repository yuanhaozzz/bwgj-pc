import { SERVER_RENDER_HOST } from '../utils/map';
let prefix = '';
let UCENTER_API = '';
let LIVE_API = '';
let BASE_API = '';
let TASK_API = '';
let host = '';
if (global.window) {
    host = location.host;
    if (host.includes('175')) {
        prefix = 'rc';
    }
    if (host.includes('172')) {
        prefix = 'rc';
    }
    if (host.includes('localhost')) {
        prefix = 'rc';
    }
    if (host.includes('preonlineh5')) {
        prefix = 'rc';
    }
} else {
    prefix = SERVER_RENDER_HOST;
}
switch (prefix) {
    case 'dev':
        UCENTER_API = 'http://dev-api-mp.szy.net/proxy/mallAdmin';
        BASE_API = 'http://dev-api-mp.szy.net/proxy/mallAdmin';
        LIVE_API = 'http://dev-api-mp.szy.net/proxy/mallAdmin';
        break;
    case 'alpha':
        UCENTER_API = 'http://dev.beiwaiguoji.com/api/ucenter/dispatch';
        LIVE_API = 'http://dev.beiwaiguoji.com/api/live/dispatch';
        BASE_API = 'http://dev.beiwaiguoji.com/api/base/dispatch';
        break;
    case 'rc':
        UCENTER_API = 'https://preonline.beiwaiguoji.com/api/ucenter/dispatch';
        LIVE_API = 'https://preonline.beiwaiguoji.com/api/live/dispatch';
        BASE_API = 'https://preonline.beiwaiguoji.com/api/base/dispatch';
        TASK_API = 'https://preonlineapi.beiwaiguoji.com/api/homework';
        break;
    default:
        UCENTER_API = 'https://api.beiwaiguoji.com/api/ucenter/dispatch';
        LIVE_API = 'https://api.beiwaiguoji.com/api/live/dispatch';
        BASE_API = 'https://api.beiwaiguoji.com/api/base/dispatch';
        TASK_API = 'https://api.beiwaiguoji.com/api/homework';
        break;
}
const ucenterPath = (path = '') => UCENTER_API + path;
const livePath = (path = '') => LIVE_API + path;
const basePath = (path = '') => BASE_API + path;
const taskApi = (path = '') => TASK_API + path;

export {
    ucenterPath,
    livePath,
    basePath,
    taskApi
};
