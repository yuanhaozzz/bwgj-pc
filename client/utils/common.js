import intl from '../utils/international';

/**
 * 时间过滤器
 * @param {number} time 
 * @param {string} fmt 
 */
export let format = (time, fmt) => {
    if (!time) return '';
    fmt = fmt || 'yyyy-MM-dd hh:mm';
    let date = new Date(time);

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }

    let dt = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };

    for (let key in dt) {
        if (new RegExp(`(${key})`).test(fmt)) {
            let str = dt[key] + '';
            fmt = fmt.replace(RegExp.$1,
                (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length)
            );
        }
    }
    return fmt;
};

export function intlType (userType, page, key) {
    if (!userType) {
        return '';
    }
    userType = userType === 'teacher' ? 'en' : 'zh';
    return intl[page][key][userType];
}

/**
 * es6 find方法  查找日期
 * @param {Array} arr 
 * @param {string} key 
 * @param {string} value 
 */
export let arrayFind = (arr, key, value) => {
    // eslint-disable-next-line no-debugger
    for (var i = 0; i < arr.length; i++) {
        if (format(arr[i][key], 'yyyy-MM-dd') === value) {
            return arr[i];
        }
    }
    return false;

};

/**
 * es6 find方法  查找对象
 * @param {Array} arr 
 * @param {string} key 
 * @param {string} value 
 */
export let arrayFindTo = (arr, key, value) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            return arr[i];
        }
    }
    return false;

};

/**
 * 设置cookie
 * @param {string} key 
 * @param {*} val 
 * @param {*} time 
 */

export let setCookie = function (key, val, time) { //设置cookie方法
    let data = JSON.parse(val);
    if (data.subUserInfoVoList.length > 0) {
        data.subUserInfoVoList.forEach(item => {
            item.userName = encodeURIComponent(item.userName);
        });
    } else {
        data.userName = encodeURIComponent(data.userName);
    }
    var date = new Date(); //获取当前时间
    var expiresDays = time;  //将date设置为n天以后的时间
    date.setTime(date.getTime() + expiresDays * 60 * 60 * 24 * 1000); // 设置过期时间 单位：天
    document.cookie = key + "=" + JSON.stringify(data) + ";expires=" + date.toGMTString() + ";path=/";  //设置cookie
};

/**
 * 获取cookie
 */
export function getCookie (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    return null;
}

/**
 * 删除cookie
 * @param {*} name 
 */
export function delCookie (name) {
    document.cookie = name + "=" + null + ";expires=" + 0 + ";path=/";
}


/**
 * 查询当前URL search 参数
 */
export let queryUrlValue = () => {
    let search = location.search.substring(1).split('&');
    let params = {};
    search.forEach(item => {
        let value = item.split('=');
        params[value[0]] = value[1];
    });
    return params;
};

export let getPlatform = function () {
    return window && window.WCRClassRoom && window.WCRClassRoom.getClientType();
};

// 生成设备唯一标识
export let setUuid = () => {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};

// 获取url参数
export const queryUrlParams = url => {
    let value = {};
    if (!location.search.includes('?')) {
        return value;
    }
    let search = location.search.split('?')[1];
    let splitSearch = search.split('&');
    splitSearch.forEach(item => {
        let splitItem = item.split('=');
        value[splitItem[0]] = splitItem[1];
    });
    return value;
};


export function computedEntryCourseTime (minute, start = '2030-01-01 00:00') {
    // 15分钟
    let limit = 1000 * 60 * minute;
    let startTime = +new Date(start);
    let nowDate = +new Date();
    let Expired = true;
    if ((startTime - limit) > nowDate) {
        Expired = false;
    }
    // debugger;
    return Expired;
}

/**
 * 
 * @param {} endTime  过期时间
 */

export function computedExpireDate (endTime) {
    let currentTime = +new Date();
    let end = +new Date(endTime);
    let Expired = true;
    if (end < currentTime) {
        Expired = false;
    }
    return Expired;
}