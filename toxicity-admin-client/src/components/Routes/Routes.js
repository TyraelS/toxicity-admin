import { Switch, Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';

import PrivateRoute from '../PrivateRoute';
import Login from '../Login';
import AdminPanel from '../AdminPanel';
import UserPage from '../UserPage';

const Routes = () => {
	const loggedIn = useSelector(state => !!state.getIn(['user', 'sessionToken']));
	const userRole = useSelector(state => !!state.getIn(['user', 'role']));

	return (
		<Switch>
			<Route exact path="/login" component={ Login } />
			{(loggedIn && userRole !== 'admin') && <Route exact path="/" component={ AdminPanel } /> }
			{(!loggedIn || userRole !== 'admin') && <Route exact path="/" component={ UserPage } /> }

			<Redirect to="/" />
		</Switch>
	)
};

export default Routes;
