import { RSAA } from 'redux-api-middleware';
import { Map } from 'immutable';

import { getEndpointUrl } from '../utils/fetchHelpers';

export const POST_FETCH_REQUEST = 'POST_FETCH_REQUEST';
export const POST_FETCH_SUCCESS = 'POST_FETCH_SUCCESS';
export const POST_FETCH_FAILURE = 'POST_FETCH_FAILURE';

export const POST_MODERATE_REQUEST = 'POST_MODERATE_REQUEST';
export const POST_MODERATE_SUCCESS = 'POST_MODERATE_SUCCESS';
export const POST_MODERATE_FAILURE = 'POST_MODERATE_FAILURE';

export const POSTS_SEND_REQUEST = 'POSTS_SEND_REQUEST';
export const POSTS_SEND_SUCCESS = 'POSTS_SEND_SUCCESS';
export const POSTS_SEND_FAILURE = 'POSTS_SEND_FAILURE';

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

export const moderatePost = (postId, status) => (dispatch, getState) => {
	const sessionToken = getState().getIn(['user', 'sessionToken']);

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('moderate'),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': sessionToken
			},
			body: JSON.stringify({
				postId,
				status
			}),
			types: [
				POST_MODERATE_REQUEST,
				POST_MODERATE_SUCCESS,
				POST_MODERATE_FAILURE
			]
		}
	});
};

export const sendPost = (content) => (dispatch, getState) => {
	const sessionToken = getState().getIn(['user', 'sessionToken']);

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('sendPost'),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': sessionToken
			},
			body: JSON.stringify({
				content
			}),
			types: [
				POSTS_SEND_REQUEST,
				POSTS_SEND_SUCCESS,
				POSTS_SEND_FAILURE
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
