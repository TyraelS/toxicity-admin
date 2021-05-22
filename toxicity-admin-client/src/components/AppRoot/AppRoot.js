import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { postsActions, userActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const AppRoot = () => {
	const [fetchPosts, auth, getUserProfile] = useActionCreators([postsActions.fetchPosts, userActions.auth, userActions.getUserProfile]);
	const sessionToken = useSelector(state => state.getIn(['user', 'sessionToken']));

	useEffect(() => {
		if(sessionToken){
			getUserProfile();
			fetchPosts();
		} else {
			auth('shit@gmail.com', 'fgfjasfd13s').then(() => {
				getUserProfile();
				fetchPosts();
			});
		}
	}, []);

	return <div></div>
}

export default AppRoot;
