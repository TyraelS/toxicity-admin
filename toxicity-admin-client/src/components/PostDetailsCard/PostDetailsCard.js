import { Radar } from 'react-chartjs-2';
import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
	'grid-container': {
		display: 'grid',
		gridTemplateColumns: '2fr 1fr 1fr 1fr',
		gridTemplateRows: '1fr 1fr',
		gap: '0px 0px',
		gridTemplateAreas: `
			"chart chart description description"
			"chart chart controls controls"
		`,
		height: '100%',
		width: '100%'
	  },
	  'chart': {
		  gridArea: 'chart'
	  },
	  'description': {
		  gridArea: 'description'
		},
	  'controls': {
		  gridArea: 'controls'
		}
}));

const PostDetailsCard = ({post}) => {
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
		maintainAspectRatio: false
	};

	return (
			<div className={classes['grid-container']}>
				<div className={classes.chart}>
					<Radar width="75%" height="90%" data={data} options={options}/>
				</div>
				<div className={classes.description}></div>
				<div className={classes.controls}></div>
			</div>
	);

};

export default memo(PostDetailsCard);
