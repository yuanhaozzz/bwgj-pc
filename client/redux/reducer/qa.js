import { QA_HOME } from '../actionTypes';

let defaultValue = {
    qaHomeList: []
};

export default function (state = defaultValue, actions) {
    let { payload, type } = actions;
    switch (type) {
        case QA_HOME:
            return {
                ...state,
                ...payload
            };
        default:
            return state;
    }
}