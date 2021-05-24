import { RSAA } from 'redux-api-middleware';
import { Map } from 'immutable';

import { getEndpointUrl } from '../utils/fetchHelpers';

export const POST_FETCH_REQUEST = 'POST_FETCH_REQUEST';
export const POST_FETCH_SUCCESS = 'POST_FETCH_SUCCESS';
export const POST_FETCH_FAILURE = 'POST_FETCH_FAILURE';

export const CLEAR_POST = 'CLEAR_POST';

export const fetchPost = (postId) => (dispatch, getState) => {
	const sessionToken = getState().getIn(['user', 'sessionToken']);

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('post', {postId}),
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': sessionToken
			},
			types: [
				POST_FETCH_REQUEST,
				POST_FETCH_SUCCESS,
				POST_FETCH_FAILURE
			]
		}
	});
};

export const clearPost = () => ({
	type: CLEAR_POST
})


const postReducer = (state = Map(), action = {}) => {
	switch(action.type){
		case POST_FETCH_SUCCESS:
			if(action.payload.post){
				return state.set('postView', action.payload.post);
			}
			return state;
		case CLEAR_POST:
			return state.clear();
		default:
			return state;
	}
}

export default postReducer;
