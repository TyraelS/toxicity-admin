import { RSAA } from 'redux-api-middleware';
import { Map } from 'immutable';

import config from '../config';
import { getEndpointUrl } from '../utils/fetchHelpers';

export const POSTS_FETCH_REQUEST = 'POSTS_FETCH_REQUEST';
export const POSTS_FETCH_SUCCESS = 'POSTS_FETCH_SUCCESS';
export const POSTS_FETCH_FAILURE = 'POSTS_FETCH_FAILURE';

export const fetchPosts = () => (dispatch, getState) => {
	const userId = getState().getIn(['user', 'userId']);

	return dispatch({
		[RSAA]: {
			endpoint: getEndpointUrl('posts', {userId}),
			method: 'GET',
			headers: {
				['Content-Type']: 'application/json'
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
		default:
			console.log(action);
			return state;
	}
}

export default postsReducer;
