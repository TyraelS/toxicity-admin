import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props) => {
	const loggedIn = useSelector(state => !!state.getIn(['user', 'sessionToken']));
	if (loggedIn) {
		return <Route { ...props } />;
	} else {
		return <Redirect to="/login" />;
	}
}

export default PrivateRoute;
