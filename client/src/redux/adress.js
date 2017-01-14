import {GET, dispatchAndPromise} from '../utils/ajax';

// Actions
const LOAD_DISTRICT = 'app/adress/LOAD_DISTRICT';
const LOAD_COUNTY = 'app/adress/LOAD_COUNTY';
const CREATE = 'app/adress/CREATE';
const UPDATE = 'app/adress/UPDATE';
const REMOVE = 'app/adress/REMOVE';

// Reducer
export default function reducer(state = {}, action = {}) {
    switch (action.type) {
        // do reducer stuff
        default:
            return state;
    }
}

// Action Creators
export const loadDistricts = () =>
    (dispatch, getState) =>
        GET("distritos").then(payload => dispatchAndPromise(dispatch, LOAD_DISTRICT, payload));

export const loadCountys = (distrito) =>
    (dispatch, getState) =>
        GET(`concelhos/${distrito}`).then(payload => dispatchAndPromise(dispatch, LOAD_COUNTY, payload));