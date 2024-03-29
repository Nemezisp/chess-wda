import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';

import reducer from './reducer';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger)
};

export const store = createStore(reducer, applyMiddleware(...middlewares));