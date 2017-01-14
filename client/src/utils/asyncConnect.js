import {connect} from 'react-redux';
import _ from 'lodash';

import Store from '../store';

export const LOAD = 'app/asyncConnect/LOAD';
export const LOAD_SUCCESS = 'app/asyncConnect/LOAD_SUCCESS';
export const LOAD_FAIL = 'app/asyncConnect/LOAD_FAIL';
export const CLEAR = 'app/asyncConnect/CLEAR';
export const BEGIN_GLOBAL_LOAD = 'app/asyncConnect/BEGIN_GLOBAL_LOAD';
export const END_GLOBAL_LOAD = 'app/asyncConnect/END_GLOBAL_LOAD';

const dispatch = Store.dispatch;

export function reducer(state = {loaded: false}, action = {}) {
    const stateSlice = state[action.key];

    switch (action.type) {
        case LOAD:
            return {
                ...state,
                toLoad: state.toLoad + 1,
                [action.key]: {
                    ...stateSlice,
                    loading: true,
                    loaded: false
                }
            };
        case LOAD_SUCCESS:
            return {
                ...state,
                toLoad: state.toLoad - 1,
                [action.key]: {
                    ...stateSlice,
                    loading: false,
                    loaded: true,
                    data: action.data
                }
            };
        case LOAD_FAIL:
            return {
                ...state,
                toLoad: state.toLoad - 1,
                [action.key]: {
                    ...stateSlice,
                    loading: false,
                    loaded: false,
                    error: action.error
                }
            };
        default:
            return state;
    }
}

const load = (key) => ({type: LOAD, key});
const loadSuccess = (key, data) => ({type: LOAD_SUCCESS, key, data});
const loadFail = (key, error) => ({type: LOAD_FAIL, key, error});


export default (mappers, mapDispatchToProps, mergeProps, options) => (Component) => {
    let _mapStateToProps = () => ({});//empty
    let promiseMappers;
    let toLoad = -1;
    const mapToPromises = (mappers, state, props) => {
        toLoad = 0;
        return Object.keys(mappers).reduce((acc, key) => {
            // if we pass a mapStateToProps function, handle it has a normal one
            if (key === "mapStateToProps") {
                _mapStateToProps = mappers[key];
                return acc;
            }
            const mapper = mappers[key];
            let result = mapper({state, props, dispatch});
            if (result instanceof Promise) {
                toLoad++;
                dispatch(load(key));
                result.then(data => {
                    toLoad--;
                    dispatch(loadSuccess(key, data))
                })
                    .catch(error => {
                        toLoad--;
                        dispatch(loadFail(key, error));
                    })
            } else {
                dispatch(loadSuccess(key, result));
            }

            return [...acc, key];
        }, []);
    };

    
    let oldProps;
    const mapStateToProps = (state, props) => {
        console.log(_.isEqual(props, oldProps), props, oldProps);
        if (!promiseMappers && !_.isEqual(props, oldProps)) promiseMappers = mapToPromises(mappers, state, props);
        oldProps=props;
        const finalProps = promiseMappers.reduce((acc, key) => {
            return {...acc, [key]: state.asyncConnect[key] && state.asyncConnect[key].data}
        }, _mapStateToProps());
        finalProps.isLoading = toLoad !== 0;
        return finalProps;
    };
    return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(Component)

}