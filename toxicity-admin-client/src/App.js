import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import AppRoot from './components/AppRoot';

import store from './store';

const App = () => {
  return (
	<BrowserRouter>
		<Provider store={ store }>
			<AppRoot />
		</Provider>
	</BrowserRouter>
  );
};

export default App;
