
import { LOGIN, TEST, INTL } from '../actionTypes';

let initialState = {
    userInfo: {},
    list: [],
    userType: 'teacher'
};

/**
 * 韩香香
 * { "buzExtField1": "40630", "buzUserId": "447", "buzUserType": "t", "createTime": 1563785821000, "email": "hanxiangjun@beiwaiguoji.com", "isLoginUser": 1, "lastModifyTime": 1563785821000, "loginName": "hanxiangjun", "loginToken": "8b68e2c217da4e7e9b8871613f8f38a4", "subUserInfoVoList": [], "userId": 1162378, "userName": "韩香君", "userStatus": 1, "userType": 1, "select": true }
 * 
 * 测试学员3
{"isLoginUser":0,"loginToken":"f260c64300094db5a20aea7ddc275145","subUserInfoVoList":[{"birthday":"2011-10-24","buzExtField1":"55027","buzExtField2":"78601","buzLineId":1,"buzUserId":"51074","buzUserType":"s","createTime":1563786307000,"gender":1,"isLoginUser":1,"lastModifyTime":1563786307000,"loginName":"student3","studyNumber":"16160545","subUserInfoVoList":[],"sysLineId":1,"userId":1213973,"userName":"测试学员3","userStatus":1,"userType":2,"select":true}]}
 * 
 * 
 */



export default function (state = initialState, actions) {
    switch (actions.type) {
        case LOGIN:
            // eslint-disable-next-line no-case-declarations
            let { payload } = actions;
            return {
                ...state,
                ...(actions.payload)
            };
        case TEST:
            return {
                ...state,
                ...(actions.payload)
            };
        case INTL:
            return {
                ...state,
                ...(actions.payload)
            };
        default:
            return state;
    }
}