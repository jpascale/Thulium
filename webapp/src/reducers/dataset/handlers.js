import C from '../../constants/auth';
import objectAssign from 'object-assign';

export default {
  [C.AUTHENTICATED] : (state, data) => {
		return objectAssign({}, state, data);
	},

	[C.LOGGING_IN] : (state) => {
		return objectAssign({}, state, { loggingIn: true });
	},

	[C.LOGGED_IN] : (state) => {
		return objectAssign({}, state, { loggingIn: false });
	},

	[C.FETCHED_PROFILE] : (state, data) => {
		return objectAssign({}, state, { profile: data });
	},

	[C.LOGOUT] : (state, data) => {
		const nextState = { loggingIn: state.loggingIn };
		return nextState;
		// return objectAssign({}, state, {  })
	}
}