import Axios from 'axios';
import { message } from 'antd';
import qs from 'qs';
import md5 from "js-md5";
import { queryUrlParams } from '../utils/common';
const ucentKey = "eEhOb%3XbA2QvucIBnfff@Jq9Ua%5SW!";

const Ajax = Axios.create({
    timeout: 6000
});
Ajax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//添加请求拦截器
Ajax.interceptors.request.use(function (config) {
    // post数据序列化  针对post需要
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, function (error) {
    loadinginstace.close();
    return Promise.reject(error);
});

const API = {
    get (url, params, conf = {}, type = 'live') {
        return new Promise((resolve, reject) => {
            Ajax.get(url, {
                params,
                conf
            }).then(res => {
                let returnCode = type === 'live' ? res.data.status.code : res.data.code;
                if (type === 'task') {
                    if (returnCode === 200) {
                        resolve(res.data);
                    } else {
                        reject(res);
                    }
                } else {
                    res.data.data.systemDate = res.data.systemDate;
                    if (returnCode === 0) {
                        resolve(res.data.data);
                    } else if (returnCode === 200) {
                        resolve(res.data);
                    } else if (global.window) {
                        message.config({
                            top: 270,
                            duration: 2,
                            maxCount: 3,
                        });
                        message.error(res.data.status.message);
                        reject(res.data.message);
                    } else {
                        console.log(res.data.status.message);
                    }
                }
            }).catch(() => {
                // message.error(err.message);
                reject();
            });
        });
    },
    post (url, params, conf = {}) {
        return new Promise((resolve, reject) => {
            Ajax.post(url, params, conf).then((res) => {
                let returnCode = res.data.status.code;
                res.data.data.systemDate = res.data.systemDate;
                if (returnCode === 0) {
                    resolve(res.data.data);
                } else if (global.window) {
                    message.config({
                        top: 270,
                        duration: 2,
                        maxCount: 3,
                    });
                    if (returnCode === 100002 || returnCode === 100003) {
                        if (queryUrlParams().userType === 'teacher') {
                            message.error('Invalid password');
                            reject(res.data.message);
                            return;
                        }
                    }
                    message.error(res.data.status.message);
                    reject(res.data.message);
                } else {
                    console.log(res.data.status.message);
                }
            }).catch(() => {
                // message.error(err.message);
                reject();
            });
        });
    },
    /**
     * 
     * @param {*} params 
     * java 不转义的 _-. *
     * #define SPECIFED_CHARACTERS @"~!@#$%^&()+={}':;,[]\\<>?~！\" \' ''￥%……（）【】‘；：" "’“。，、？——|/`《》€ £ "
     */
    getSign (params) {
        var arr = [];
        for (var i in params) {
            arr.push((i + "=" + encodeURIComponent(params[i])).replace(/(~|!|\(|\)|\')/g, code => {
                return this.encodePassword[code];
            }));
        }
        var paramsStr = arr.join(("&"));
        var urlStr = paramsStr.split("&").sort().join("&");
        // 签名前 添加 timestamp  有则添加  没有则空串
        var newUrl = urlStr + '&timestamp=&key=' + ucentKey;
        console.log(newUrl);
        return md5(newUrl).toUpperCase();
    },
    encodePassword: {
        '~': '%7E',
        '!': '%21',
        '(': '%28',
        ')': '%29',
        "'": '%27'
    }

};

export { API };
