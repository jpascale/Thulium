import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import appReducer from './app/';
import authReducer from './auth/';
import datasetReducer from './dataset/';

const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	dataset: datasetReducer,
  // routing: routerReducer
});

export default rootReducer;
