import { useEffect, useState} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useSelector } from 'react-redux';

import { userActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const useStyles = makeStyles((theme) => ({
	root: {
		paddingTop: theme.spacing(5),
		paddingBottom: theme.spacing(10),
		minHeight: '100%',
		'& > *': {
			marginTop: theme.spacing(5)
		}
	},
	formHolder: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& > *': {
			marginTop: theme.spacing(5)
		}
	},
	title: {
	 	textAlign: 'center'
	},
	spinnerHolder:{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '80vh'
	}
}));

const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/


const Login = () => {
	const classes = useStyles();
	const [ email, setEmail ] = useState('');
	const [ emailError, setEmailError ] = useState();
	const [ password, setPassword] = useState('');
	const [ passwordError, setPasswordError ] = useState();
	const [ emailManuallyChanged, setEmailManuallyChanged ] = useState(false);
	const [ passwordManuallyChanged, setPasswordManuallyChanged ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ auth ] = useActionCreators([userActions.auth]);
	const loggedIn = useSelector(state => !!state.getIn(['user', 'sessionToken']));
	const location = useLocation();
	const history = useHistory();

	useEffect(() => {
		if(loggedIn && location.pathname === '/login'){
			history.replace('/');
		}
	}, [loggedIn, location, history]);

	useEffect(() => {
		if(passwordManuallyChanged && password.length < 6){
			!passwordError && setPasswordError('minimum length is 6')
		} else {
			passwordError && setPasswordError(false)
		}

		if(emailManuallyChanged && !email.match(re)){
			!emailError && setEmailError('invalid email')
		} else {
			emailError && setEmailError(false)
		}
	}, [email, password, passwordManuallyChanged, emailManuallyChanged, emailError, passwordError]);

	const onEmailChange = (e) => {
		!emailManuallyChanged && setEmailManuallyChanged(true)
		setEmail(e.target.value);
	}

	const onPasswordChange = (e) => {
		!passwordManuallyChanged && setPasswordManuallyChanged(true);
		setPassword(e.target.value);
	}

	const login = () => {
		setLoading(true);
		auth(email, password).then(() => {
			setLoading(false);
		});
	};

	return (
		<Container className={classes.root} maxWidth="sm">
			{loading && <Box className={classes.spinnerHolder}>
				<CircularProgress />
			</Box> }
			{ !loading && <Typography className={classes.title} variant="h3">Please provide your credentials</Typography> }
			{ !loading && <form className={classes.formHolder} autoComplete="off">
  				<TextField required error={ emailError } helperText={emailError} fullWidth id="email" label="Email" variant="outlined" onChange={onEmailChange}/>
  				<TextField required error={ passwordError} helperText = { passwordError } fullWidth type="password" id="password" label="Password" variant="outlined" onChange={onPasswordChange} />
				<Button size="large" variant="contained" disabled={!email || !password || emailError || passwordError} fullWidth disableElevation color="primary" onClick={login}>Login</Button>
			</form> }
		</Container>
	)
};

export default Login;
