import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Map } from 'immutable';

import { userActions } from '../../ducks';

import PostDetailsCard from '../../components/PostDetailsCard';
import AppHeader from '../../components/AppHeader';
import Routes from '../../components/Routes';

import useActionCreators from '../../hooks/useActionCreators';

import Holder, { AppContainer } from './AppRoot.style';

const AppRoot = () => {
	const [getUserProfile] = useActionCreators([userActions.getUserProfile]);
	const sessionToken = useSelector(state => state.getIn(['user', 'sessionToken']));
	const posts = useSelector(state => state.get('posts', Map())).toList().toJS();

	useEffect(() => {
		if(sessionToken){
			getUserProfile();
		}
	}, [sessionToken, getUserProfile]);

	return (
		<Holder>
			<AppContainer disableGutters>
				<AppHeader/>
				<Routes />
					{posts.map((post) =>
						<PostDetailsCard post={post} key={post._id} />
					)}
			</AppContainer>
		</Holder>
	);
}

export default AppRoot;
