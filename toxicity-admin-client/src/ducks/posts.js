import { RSAA } from 'redux-api-middleware';
import { fromJS, Map } from 'immutable';

import config from '../config';
import { getEndpointUrl } from '../utils/fetchHelpers';

import { LOGOUT } from './user';

export const POSTS_FETCH_REQUEST = 'POSTS_FETCH_REQUEST';
export const POSTS_FETCH_SUCCESS = 'POSTS_FETCH_SUCCESS';
export const POSTS_FETCH_FAILURE = 'POSTS_FETCH_FAILURE';

export const fetchPosts = () => (dispatch, getState) => {
	const userId = getState().getIn(['user', 'userId']);
	const sessionToken = getState().getIn(['user', 'sessionToken']);

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('posts', {userId}),
			method: 'GET',
			headers: {
				['Content-Type']: 'application/json',
				['x-auth-token']: sessionToken
			},
			types: [
				POSTS_FETCH_REQUEST,
				POSTS_FETCH_SUCCESS,
				POSTS_FETCH_FAILURE
			]
		}
	});
};

const postsReducer = (state = Map(), action = {}) => {
	switch(action.type){
		case POSTS_FETCH_SUCCESS:
			if(action.payload.posts){
				return action.payload.posts.reduce((acc, post) => {
					return acc.set(post._id, post);
				}, Map());
			}

			return state;
		case LOGOUT:
			return state.clear()
		default:
			return state;
	}
}

export default postsReducer;
