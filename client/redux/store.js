import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducer from './reducer/index';

// 返回不同实例store
export function createClientStore () {
    let defaultState = window._REACT_SOTRE ? window._REACT_SOTRE : {};
    return createStore(Reducer, defaultState, applyMiddleware(thunk));
}

export function createServerStore () {
    return createStore(Reducer, applyMiddleware(thunk));
}
