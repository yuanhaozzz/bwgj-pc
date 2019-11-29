import { API } from '../api';
import { taskApi, livePath } from '../apiHost';

export default {
    async getStudyCount (params) {
        return await API.post(livePath(), params, {});
    },
    async getStatistics (params) {
        return await API.get(taskApi('/statistics'), params, {}, 'task');
    }
};