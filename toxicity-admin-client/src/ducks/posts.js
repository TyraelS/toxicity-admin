import { RSAA } from 'redux-api-middleware';
import { OrderedMap } from 'immutable';

import { getEndpointUrl } from '../utils/fetchHelpers';

import { LOGOUT } from './user';

export const POSTS_FETCH_REQUEST = 'POSTS_FETCH_REQUEST';
export const POSTS_FETCH_SUCCESS = 'POSTS_FETCH_SUCCESS';
export const POSTS_FETCH_FAILURE = 'POSTS_FETCH_FAILURE';

export const CLEAR_POSTS = 'CLEAR_POSTS';

export const fetchPosts = (tab) => (dispatch, getState) => {
	const sessionToken = getState().getIn(['user', 'sessionToken']);

	const tabs = [
		'open',
		'deleted',
		'moderated'
	];

	let params = {};

	if(tab !== undefined){
		params = {
			[`${tabs[tab]}`]: true
		}
	}

	const headers = {
		'Content-Type': 'application/json',
	};

	if(sessionToken){
		headers['x-auth-token'] = sessionToken;
	}

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('posts', {...params}),
			method: 'GET',
			headers,
			types: [
				POSTS_FETCH_REQUEST,
				POSTS_FETCH_SUCCESS,
				POSTS_FETCH_FAILURE
			]
		}
	});
};

export const clearPosts = () => ({
	type: CLEAR_POSTS
})

const postsReducer = (state = OrderedMap(), action = {}) => {
	switch(action.type){
		case POSTS_FETCH_SUCCESS:
			if(action.payload.posts){
				return action.payload.posts.reduce((acc, post) => {
					return acc.set(post._id, post);
				}, OrderedMap());
			}

			return state;
		case LOGOUT:
		case CLEAR_POSTS:
			return state.clear()
		default:
			return state;
	}
}

export default postsReducer;
