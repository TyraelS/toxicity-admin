import { Radar } from 'react-chartjs-2';
import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import { postActions, postsActions } from '../../ducks';
import useActionCreators from '../../hooks/useActionCreators';

const useStyles = makeStyles((theme) => ({
	'grid-container': {
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		gridTemplateRows: '1fr',
		gap: '0px 0px',
		gridTemplateAreas: `
			"chart description"
		`,
		height: '100%',
		width: '100%',
		'@media (max-width: 960px)':{
			gridTemplateColumns: '1fr',
			gridTemplateRows: '1fr 1fr',
			gridTemplateAreas: `
				"chart"
				"description"
			`
		}
	  },
	  'chart': {
		  gridArea: 'chart',
		  '& > *':{
			  maxHeight: '100%'
		  }
	  },
	  'description': {
		  gridArea: 'description',
		  display: 'flex',
		  flexDirection: 'column',
		  '& > *':{
			  margin: theme.spacing(2),
		  }
		},
		'info': {
			flexGrow: 1,
			overflowY: 'scroll'
		},
		'controls':{
			height: '20%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			'& > *':{
				flexGrow: '1',
				margin: theme.spacing(1)
			}
		}
}));

const PostDetailsCard = ({post, closeHandler}) => {
	const [ moderatePost, fetchPosts ] = useActionCreators([postActions.moderatePost, postsActions.fetchPosts]);
	const classes = useStyles();
	const chartLabels = post.moderation.analysisResult.map(item => item.label);
	const chartData = post.moderation.analysisResult.map(item => item.results[0].probabilities[1]);
	const data = {
		labels: chartLabels,
		datasets: [
		  {
			label: 'Violation Probability',
			data: chartData,
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 1,
		  },
		],
	};

	const options = {
		scale: {
		  ticks: { beginAtZero: true },
		},
		// maintainAspectRatio: false
	};

	const moderatePostHandler = (status) => () => {
		moderatePost(post.id, status).then(() => {
			fetchPosts();
			closeHandler();
		})
	};

	return (
			<div className={classes['grid-container']}>
				<div className={classes.chart}>
					<Radar width="75%" height="90%" data={data} options={options}/>
				</div>
				<div className={classes.description}>
					<div className={classes.info}>
						<Typography variant="body1">Post ID: {post.id} </Typography>
						<Divider />
						<Typography variant="body1">Author: {post.username}</Typography>
						<Divider />
						<Typography variant="body1">Email: {post.email}</Typography>
						<Divider />
						<Typography variant="body1">Author ID: {post.userId}</Typography>
						<Divider />
						<Typography variant="body2">Status: {post.status}</Typography>
						<Divider />
						<Typography variant="body2">Post content: {post.content}</Typography>
						<Divider />
						<Typography variant="body1">Severity: {post.moderation.severityCoefficient} </Typography>
						<Divider />
						<List>
							{post.moderation.analysisResult.map((item, index) =>
								<ListItem button key={index}>
									<ListItemText primary={`${item.label}: ${item.results[0].probabilities[1]}`}></ListItemText>
								</ListItem>
							)}
						</List>
					</div>
					<div className={classes.controls}>
						<Button size="large" variant="contained" onClick={moderatePostHandler('open')} disableElevation color="primary">Mark as safe</Button>
						<Button size="large" variant="contained" onClick={moderatePostHandler('blocked')} disableElevation color="secondary">Delete</Button>
					</div>
				</div>
			</div>
	);

};

export default memo(PostDetailsCard);
