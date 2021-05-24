import jsStyled from 'styled-components';
import { styled } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

export const AppContainer = styled(Container)({
	background: '#eee',
	minHeight: '100vh'
});

export default jsStyled.div`
	width: 100%;
	min-height: 100vh;
	background-color: #ddd;
`;
