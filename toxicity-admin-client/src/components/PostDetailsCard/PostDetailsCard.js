import { Radar } from 'react-chartjs-2';

const PostDetailsCard = ({post}) => {
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
	};

	return <Radar data={data} options={options}/>
};

export default PostDetailsCard;
