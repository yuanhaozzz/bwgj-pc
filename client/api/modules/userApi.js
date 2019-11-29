import { API } from '../api';
import { ucenterPath } from '../apiHost';

export default {
    async getUserInfo (params) {
        params.sign = API.getSign(params);
        return await API.post(ucenterPath(), params, {});
    },

    async sendCode (params) {
        params.sign = API.getSign(params);
        return await API.post(ucenterPath(), params, {});
    },

    async getPhoneUserInfo (params) {
        params.sign = API.getSign(params);
        return await API.post(ucenterPath(), params, {});
    }
};
