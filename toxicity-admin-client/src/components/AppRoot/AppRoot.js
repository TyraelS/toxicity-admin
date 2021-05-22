import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Map } from 'immutable';

import { postsActions, userActions } from '../../ducks';

import PostDetailsCard from '../../components/PostDetailsCard';

import useActionCreators from '../../hooks/useActionCreators';

const AppRoot = () => {
	const [fetchPosts, auth, getUserProfile] = useActionCreators([postsActions.fetchPosts, userActions.auth, userActions.getUserProfile]);
	const sessionToken = useSelector(state => state.getIn(['user', 'sessionToken']));
	const posts = useSelector(state => state.get('posts', Map())).toList().toJS();

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

	return (
		<div>
			hello
			{posts.map((post) =>
				<PostDetailsCard post={post} key={post._id} />
			)}
		</div>
	);
}

export default AppRoot;
