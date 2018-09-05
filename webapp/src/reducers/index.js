import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import appReducer from './app/'

const rootReducer = combineReducers({
	app: appReducer,
  routing: routerReducer
});

export default rootReducer;
