import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { Map, fromJS, Set, isIndexed } from 'immutable';
import Immutable from 'immutable';
import Cookies from 'js-cookie';

import { postsReducer, userReducer } from '../ducks';

const rootReducer  = combineReducers({
	posts: postsReducer,
	user: userReducer
});

const getInitialStore = () => {
	const initialStore = Map();

	return initialStore.withMutations(initialStore => {
		if(Cookies.get('sessionToken')){
			initialStore.setIn(['user', 'sessionToken'], Cookies.get('sessionToken'));
		}
	});
};

const reduxDevTools =
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
	window.__REDUX_DEVTOOLS_EXTENSION__({ serialize: { immutable: Immutable } });

const middleware = applyMiddleware(
	thunk,
	apiMiddleware,
);

export default createStore(rootReducer, getInitialStore(), reduxDevTools ? compose(middleware, reduxDevTools) : middleware);
