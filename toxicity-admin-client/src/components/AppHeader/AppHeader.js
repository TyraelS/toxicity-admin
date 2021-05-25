import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { userActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const useStyles = makeStyles((theme) => ({
	root:{
		'& > *': {
			margin: theme.spacing(0.5),
		}
	},
	title: {
	 	flexGrow: 1
	},
	menuButton: {
		color: "#fff"
	}
}));

const AppHeader = () => {
	const [ logout ] = useActionCreators([userActions.logout]);
	const classes = useStyles();
	const loggedIn = useSelector(state => !!state.getIn(['user', 'sessionToken']));
	const role = useSelector(state => state.getIn(['user', 'role']));
	const history = useHistory();
	const location = useLocation();

	const openLogin = () => {
		location.pathname !== '/login' && history.push('/login');
	}

	const openRegistration = () => {
		location.pathname !== '/registration' && history.push('/registration');
	}

	const openAdmin = () => {
		location.pathname !== '/' && history.push('/');
	}

	const openBlog = () => {
		location.pathname !== '/blog' && history.push('/blog');
	}

	return (
		<AppBar position="sticky">
			<Toolbar className = {classes.root}>
				<Typography variant="h6" className={classes.title}>
					  FakeBlog
				</Typography>
				{!loggedIn && <Button variant="contained" disableElevation color="secondary" onClick={openLogin}>Login</Button>}
				{role === 'admin' && <Button variant="contained" disableElevation color="secondary" onClick={openBlog}>Blog</Button>}
				{role === 'admin' && <Button variant="contained" disableElevation color="secondary" onClick={openAdmin}>Admin Page</Button>}
				{!loggedIn && <Button variant="contained" disableElevation color="primary" onClick={openRegistration}>Registration</Button>}
				{loggedIn && <Button variant="contained" disableElevation color="secondary" onClick={logout}>Logout</Button>}
			</Toolbar>
		</AppBar>
	);
}

export default AppHeader;
