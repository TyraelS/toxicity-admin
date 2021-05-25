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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
		width: '85%',
		minHeight: '80vh',
		maxHeight: '80vh',
		overflowY: 'scroll',
		padding: theme.spacing(2, 4, 3),
		boxSizing: 'border-box'
	},
	spinnerHolder:{
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	close:{
		gridArea: 'close',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
  }));

let timer = null;

const AdminTable = ({posts, tab}) => {
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
	}, []);

	if(!posts.size){
		return (
			<Typography variant='h5'>No posts available in this category, try changing the tab</Typography>
		)
	}

	return(
		<Fragment>
			{openedPost && <PostDetailsModal tab = { tab } postId={openedPost} closePost = { closePost }/>}
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

const PostDetailsModal = memo(({postId, closePost, tab}) => {
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
					<div style={{height: '100%', width: '100%',}}>
						<div className={classes.close}>
							<CloseIcon className={classes.rowPointer} onClick = {closeHandler} fontSize="large"/>
						</div>
						<PostDetailsCard tab = { tab } post = { postInfo } closeHandler ={ closeHandler } />
					</div>}
				</div>
			</Fragment>
        </Fade>
      </Modal>
	);
});

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
	  <div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	  >
		{value === index && (
		  <Box p={3}>
			{children}
		  </Box>
		)}
	  </div>
	);
  }

  function a11yProps(index) {
	return {
	  id: `simple-tab-${index}`,
	  'aria-controls': `simple-tabpanel-${index}`,
	};
  }


const AdminPanel = () => {
	const classes = useStyles();
	const posts = useSelector(state => state.get('posts'));

	const [ fetchPosts ] = useActionCreators([postsActions.fetchPosts]);

	const [value, setValue] = useState(0);

  	const handleChange = (event, newValue) => {
    	setValue(newValue);
  	};

	useEffect(() => {
		fetchPosts(value).then(() => {
			timer = setInterval(() => fetchPosts(value), 30000)
		});

		return () => {
			clearInterval(timer);
			timer = null;
		}
	}, [fetchPosts, value]);

	return(
		<div className={classes.root}>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
					<Tab label="Open" {...a11yProps('open')} />
					<Tab label="Blocked" {...a11yProps('deleted')} />
					<Tab label="Moderated" {...a11yProps('moderated')} />
				</Tabs>
				</AppBar>
				<TabPanel value={value} index={0}>
					<AdminTable posts = { posts } tab={0}/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<AdminTable posts = { posts } tab={1}/>
				</TabPanel>
				<TabPanel value={value} index={2}>
					<AdminTable posts = { posts } tab={2}/>
				</TabPanel>
		</div>
	)
};

export default AdminPanel;
