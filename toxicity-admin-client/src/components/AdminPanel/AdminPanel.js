import { useSelector } from 'react-redux';
import { Fragment, useEffect, useState, useCallback, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { Map } from 'immutable';

import PostDetailsCard from '../PostDetailsCard';

import { postsActions, postActions } from '../../ducks';

import useActionCreators from '../../hooks/useActionCreators';

const getColor = (value) => {
	if(value <= 0.1){
		return '#007700';
	} else if (value >= 0.3){
		return '#880000';
	} else {
		return '#FCE205'
	}
}

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(7),
		'@media (max-width: 960px)':{
			padding: theme.spacing(1)
		}
	},
	rowPointer: {
		cursor: 'pointer'
	},
	ellipsisText: {
		display: 'block',
		display: '-webkit-box',
		'-webkit-line-clamp': 3,
		'-webkit-box-orient': 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		wordBreak: 'break-word'
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	  },
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		width: '75%',
		height: '80vh',
		overflowY: 'scroll',
		padding: theme.spacing(2, 4, 3),
	},
	spinnerHolder:{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	'close':{
		gridArea: 'close',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
  }));

let timer = null;

const AdminTable = ({posts}) => {
	const classes = useStyles();
	const [sortedPosts, setSortedPosts] = useState(posts);
	const [sortingRule, setSortingRule] = useState();
	const [order, setOrder] = useState();
	const [openedPost, setOpenedPost] = useState();

	const applySorting = useCallback((fieldName, changeOrder = true) => () => {
		if(fieldName === 'date'){
			if(sortingRule !== fieldName){
				setSortingRule('date');
				setSortedPosts(posts.sort((a, b) => {
					return Date.parse(a.date) < Date.parse(b.date);
				}));
				changeOrder && setOrder('asc');
			} else {
				setSortingRule('date');
				changeOrder && setOrder(order === 'asc' ? 'desc' : 'asc');
				setSortedPosts(sortedPosts.reverse())
			}
		} else if(fieldName === 'severityCoefficient'){
			if(sortingRule !== fieldName){
				setSortingRule('severityCoefficient');
				setSortedPosts(posts.sort((a, b) => {
					return a.moderation.severityCoefficient < b.moderation.severityCoefficient;
				}));
				changeOrder && setOrder('asc');
			} else {
				setSortingRule('severityCoefficient');
				changeOrder && setOrder(order === 'asc' ? 'desc' : 'asc');
				setSortedPosts(sortedPosts.reverse());
			}
		}
	});

	useEffect(() => {
		if(posts.size !== sortedPosts.size || !posts.keySeq().every((value) => sortedPosts.has(value))){
			setSortedPosts(posts);
			sortingRule && applySorting(sortingRule, false)
		};
	}, [sortingRule, sortedPosts, posts, applySorting]);

	const openPost = (postId) => () => {
		setOpenedPost(null);
		setOpenedPost(postId);
	}

	const closePost = useCallback(() => {
		setOpenedPost(null);
	});

	return(
		<Fragment>
			{openedPost && <PostDetailsModal postId={openedPost} closePost = { closePost }/>}
			<TableContainer component = { Paper }>
			<Table stickyHeader size="medium">
				<TableHead>
					<TableRow>
						<TableCell onClick={applySorting('date')} className={classes.rowPointer}>
							<TableSortLabel direction={sortingRule === 'date' ? order : 'asc' }>
								Date
							</TableSortLabel>
						</TableCell>
						<TableCell align="left">Content</TableCell>
						<TableCell align="left">Status</TableCell>
						<TableCell align="center" onClick={applySorting('severityCoefficient')}>
							<TableSortLabel direction={sortingRule === 'severityCoefficient' ? order : 'asc'}>
								Content Severity
							</TableSortLabel>
						</TableCell>
					</TableRow>
				</TableHead>
					<TableBody>
						{sortedPosts.map((post, index) => (
							<TableRow hover onClick = { openPost(post._id) } key={index} className={classes.rowPointer}>
								<TableCell component="th" scope="row">
									{post.date}
								</TableCell>
								<TableCell align="left">
									<span className = {classes.ellipsisText}>
										{post.content}
									</span>
								</TableCell>
								<TableCell align="left">{post.status}</TableCell>
								<TableCell align="center">
									<WarningIcon style={{color: getColor(post.moderation.severityCoefficient)}} />
									<Typography>{post.moderation.severityCoefficient.toFixed(3)}</Typography>
								</TableCell>
							</TableRow>
						)).toList().toArray()}
					</TableBody>
			</Table>
		</TableContainer>
		</Fragment>)
};

const PostDetailsModal = memo(({postId, closePost}) => {
	const classes = useStyles();
	const [ fetchPost, clearPost ] = useActionCreators([postActions.fetchPost, postActions.clearPost]);
	const [ loading, setLoading ] = useState(true);
	const [ open, setOpen ] = useState(true);
	const postInfo = useSelector(state => state.getIn(['post', 'postView' ]));

	useEffect(() => {
		fetchPost(postId).then(() => setLoading(false));
	}, [])

	const closeHandler = () => {
		setOpen(false);
		clearPost();
		setTimeout(() => closePost(), 500);
	}

	return (
		<Modal
			className={classes.modal}
			open={open}
			onClose={closeHandler}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
			timeout: 500,
		}}
      >

		<Fade in={open}>
			<Fragment>
				<div className={classes.paper}>
				{loading && <Box className={classes.spinnerHolder}>
						<CircularProgress />
				</Box> }
				{!loading && postInfo &&
					<div>
						<div className={classes.close}>
							<CloseIcon className={classes.rowPointer} onClick = {closeHandler} fontSize="large"/>
						</div>
						<PostDetailsCard post = { postInfo } closeHandler ={ closeHandler } />
					</div>}
				</div>
			</Fragment>
        </Fade>
      </Modal>
	);
});

const AdminPanel = () => {
	const classes = useStyles();
	const posts = useSelector(state => state.get('posts'));

	const [ fetchPosts ] = useActionCreators([postsActions.fetchPosts]);

	useEffect(() => {
		fetchPosts().then(() => {
			timer = setInterval(fetchPosts, 30000)
		});

		return () => {
			clearInterval(timer);
			timer = null;
		}
	}, [fetchPosts]);

	return(
		<div className={classes.root}>
			<AdminTable posts = { posts } />
		</div>
	)
};

export default AdminPanel;
