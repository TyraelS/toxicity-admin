import { Switch, Route, Redirect } from 'react-router';

import PrivateRoute from '../PrivateRoute';
import Login from '../Login';

const Routes = () => (
	<Switch>
		<Route exact path="/login" component={ Login } />

		<Redirect to="/" />
	</Switch>
);

export default Routes;
