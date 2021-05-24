import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { userActions } from '../../ducks';

import AppHeader from '../../components/AppHeader';
import Routes from '../../components/Routes';

import useActionCreators from '../../hooks/useActionCreators';

import Holder, { AppContainer } from './AppRoot.style';

const AppRoot = () => {
	const [getUserProfile] = useActionCreators([userActions.getUserProfile]);
	const sessionToken = useSelector(state => state.getIn(['user', 'sessionToken']));

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
			</AppContainer>
		</Holder>
	);
}

export default AppRoot;
