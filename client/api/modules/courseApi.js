import { API } from '../api';
import { basePath, livePath } from '../apiHost';

export default {
    async getList (type, params) {
        return await API.post(livePath(), params, {});
    },
    async sendStudioCallback (type, params) {
        return await API.post(livePath(), params, {});
    },
    async getCourseInfo (params) {
        return await API.get('http://localhost:48388/getZbyLiveInfo', params, {});
    },
    async sendLiveApi (params) {
        return await API.post(livePath(), params, {});
    },
    async sendBaseApi (params) {
        return await API.post(basePath(), params, {});
    }
};
