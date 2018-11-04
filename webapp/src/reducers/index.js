import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import appReducer from './app/';
import authReducer from './auth/';

const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
  // routing: routerReducer
});

export default rootReducer;
