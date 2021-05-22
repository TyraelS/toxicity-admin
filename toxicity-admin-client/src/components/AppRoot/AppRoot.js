import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { postsActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const AppRoot = () => {
	const [fetchPosts] = useActionCreators([postsActions.fetchPosts]);

	useEffect(() => {
		fetchPosts();
	}, [])

	return <div></div>
}

export default AppRoot;
