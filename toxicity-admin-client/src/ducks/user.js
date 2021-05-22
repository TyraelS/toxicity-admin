import { RSAA } from 'redux-api-middleware';
import { fromJS, Map } from 'immutable';
import Cookies from 'js-cookie';

import config from '../config';
import { getEndpointUrl } from '../utils/fetchHelpers';

export const USER_AUTH_REQUEST = 'USER_AUTH_REQUEST';
export const USER_AUTH_SUCCESS = 'USER_AUTH_SUCCESS';
export const USER_AUTH_FAILURE = 'USER_AUTH_FAILURE';

export const auth = (email, password) => (dispatch, getState) => {
	const userId = getState().getIn(['user', 'userId']);

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

const userReducer = (state = Map(), action = {}) => {
	switch(action.type){
		case USER_AUTH_SUCCESS:
			Cookies.set('sessionToken', action.payload.token);

			return state.set('sessionToken', action.payload.token);
		default:
			return state;
	}
}

export default userReducer;
