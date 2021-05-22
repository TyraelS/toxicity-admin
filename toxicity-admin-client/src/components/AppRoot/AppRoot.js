import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { postsActions, userActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const AppRoot = () => {
	const [fetchPosts, auth] = useActionCreators([postsActions.fetchPosts, userActions.auth]);

	useEffect(() => {
		auth('shit@gmail.com', 'fgfjasfd13s').then(() => {
			fetchPosts();
		});
	}, [])

	return <div></div>
}

export default AppRoot;
