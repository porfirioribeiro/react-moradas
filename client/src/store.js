import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

// Reducers
import * as reducers from './redux';

const loggerMiddleware = createLogger({
    collapsed: true,
    duration: true,
    diff: true,
});


const AppReducers = combineReducers(reducers);

export default createStore(

    AppReducers,

    compose(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        ),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);
