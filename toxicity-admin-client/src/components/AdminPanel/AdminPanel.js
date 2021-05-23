import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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

import { postsActions } from '../../ducks';

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
	}
  }));

let timer = null;

const AdminTable = ({posts}) => {
	const classes = useStyles();
	const [sortedPosts, setSortedPosts] = useState(posts);
	const [sortingRule, setSortingRule] = useState();
	const [order, setOrder] = useState();

	useEffect(() => {
		setSortedPosts(posts);
	}, [posts]);

	const applySorting = (fieldName) => () => {
		if(fieldName === 'date'){
			if(sortingRule !== fieldName){
				setSortingRule('date');
				setSortedPosts(posts.sort((a, b) => {
					return Date.parse(a.date) < Date.parse(b.date);
				}));
				setOrder('asc');
			} else {
				setSortingRule('date');
				setOrder(order === 'asc' ? 'desc' : 'asc');
				setSortedPosts(sortedPosts.reverse())
			}
		} else if(fieldName === 'severityCoefficient'){
			if(sortingRule !== fieldName){
				setSortingRule('severityCoefficient');
				setSortedPosts(posts.sort((a, b) => {
					return a.moderation.severityCoefficient < b.moderation.severityCoefficient;
				}));
				setOrder('asc');
			} else {
				setSortingRule('severityCoefficient');
				setOrder(order === 'asc' ? 'desc' : 'asc');
				setSortedPosts(sortedPosts.reverse());
			}
		}
	}


	return(
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
							<TableRow hover key={index} className={classes.rowPointer}>
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
		</TableContainer>)
};

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
