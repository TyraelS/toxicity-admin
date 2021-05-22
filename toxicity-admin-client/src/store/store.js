import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import { Map, fromJS, Set, isIndexed } from 'immutable';
import Immutable from 'immutable';

import { postsReducer, userReducer } from '../ducks';

const rootReducer  = combineReducers({
	posts: postsReducer,
	user: userReducer
});

const getInitialStore = () => Map();

const reduxDevTools =
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
	window.__REDUX_DEVTOOLS_EXTENSION__({ serialize: { immutable: Immutable } });

const middleware = applyMiddleware(
	thunk,
	apiMiddleware,
);

export default createStore(rootReducer, Map(), reduxDevTools ? compose(middleware, reduxDevTools) : middleware);
