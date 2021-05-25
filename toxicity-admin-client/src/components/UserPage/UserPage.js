import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { postsActions, postActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const useStyles = makeStyles((theme) => ({
	holder:{
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%'
	},
	root: {
		flexGrow: '1',
		width: '90%',
		margin: theme.spacing(2)
	},
	inputField: {
		display: 'flex',
		width: '90%',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: theme.spacing(3)
	},
	button: {
		width: '150px',
		height: '76px',
		marginLeft: theme.spacing(2)
	}
}));

let timer = null;

const UserPage = () => {
	const [fetchPosts, clearPosts, sendPost ] = useActionCreators([postsActions.fetchPosts, postsActions.clearPosts, postActions.sendPost ]);

	const posts = useSelector(state => state.get('posts'));
	const loggedIn = useSelector(state => state.getIn(['user', 'sessionToken']));

	const [inputValue, setInputValue] = useState('');
	const [loading, setLoading] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		fetchPosts().then(() => {
			timer = setInterval(() => fetchPosts(), 30000)
		});

		return () => {
			clearInterval(timer);
			timer = null;
		}
	}, [fetchPosts]);

	useEffect(() => clearPosts, []);

	const onInputChange = (e) => {
		setInputValue(e.target.value)
	}

	const sendPostHandler = () => {
		setLoading(true);
		sendPost(inputValue).then(() => {
			setLoading(false);
			setInputValue('');
			fetchPosts();
		})
	}

	return <div className={classes.holder}>
		{loggedIn && <div className={classes.inputField}>
			<TextField
				id="standard-full-width"
				label="Label"
				multiline
				style={{ margin: 8 }}
				placeholder="Text"
				helperText="Type your message here"
				fullWidth
				value={inputValue}
				margin="normal"
				onChange={onInputChange}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<Button
				onClick={sendPostHandler}
				disabled={!inputValue.length || loading}
				className={classes.button}
				pointer
				variant="contained"
				disableElevation
				color="primary"
			>
				{ loading ? 'Sending' : 'Send' }
			</Button>
		 </div>}
		{posts && posts.map((post, index) => (
			<Card className={classes.root}>
				<CardContent>
					<Typography variant="h6">
						{post.userId}
					</Typography>
					<Typography variant="body2">
						{post.content}
					</Typography>
					<Typography variant="body2">
						{post.date}
					</Typography>
				</CardContent>
			</Card>
		)).toList().toArray()}
	</div>
};

export default UserPage;
