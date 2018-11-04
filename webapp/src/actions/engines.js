import C from '../constants/engine';
import * as EngineService from '../services/engine';

const fetchingEngines = () => ({
	type: C.FETCHING
});

const fetchedEngines = (payload) => ({
	type: C.FETCHED,
	payload
});

export const fetchEngines = () => (dispatch, getState) => {
	dispatch(fetchingEngines());

	EngineService.fetchAll({}, {
		token: getState().auth.token
	}).then(engines => {
		return dispatch(fetchedEngines(engines));
	});
};