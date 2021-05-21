import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

const createStore = () => ({});

function App() {
  return (
	<BrowserRouter>
		<Provider store={ createStore() }>
			<div></div>
		</Provider>
	</BrowserRouter>
  );
};

export default App;
