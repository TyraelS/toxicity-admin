import { RSAA } from 'redux-api-middleware';
import { fromJS, Map } from 'immutable';
import Cookies from 'js-cookie';

import config from '../config';
import { getEndpointUrl } from '../utils/fetchHelpers';

export const USER_AUTH_REQUEST = 'USER_AUTH_REQUEST';
export const USER_AUTH_SUCCESS = 'USER_AUTH_SUCCESS';
export const USER_AUTH_FAILURE = 'USER_AUTH_FAILURE';

export const USER_PROFILE_REQUEST = 'USER_PROFILE_REQUEST';
export const USER_PROFILE_SUCCESS = 'USER_PROFILE_SUCCESS';
export const USER_PROFILE_FAILURE = 'USER_PROFILE_FAILURE';

export const auth = (email, password) => (dispatch, getState) => {
	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('auth'),
			body: JSON.stringify({
				email,
				password
			}),
			method: 'POST',
			headers: {
				['Content-Type']: 'application/json'
			},
			types: [
				USER_AUTH_REQUEST,
				USER_AUTH_SUCCESS,
				USER_AUTH_FAILURE
			]
		}
	});
};

export const getUserProfile = () => (dispatch, getState) => {
	const sessionToken = getState().getIn(['user', 'sessionToken']);

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('profile'),
			method: 'GET',
			headers: {
				['Content-Type']: 'application/json',
				['x-auth-token']: sessionToken
			},
			types: [
				USER_PROFILE_REQUEST,
				USER_PROFILE_SUCCESS,
				USER_PROFILE_FAILURE
			]
		}
	});
};

const userReducer = (state = Map(), action = {}) => {
	switch(action.type){
		case USER_AUTH_SUCCESS:
			Cookies.set('sessionToken', action.payload.token);

			return state.set('sessionToken', action.payload.token);
		case USER_PROFILE_SUCCESS:
			return state.merge(fromJS(action.payload.user));
		default:
			return state;
	}
}

export default userReducer;
