import C from '../constants/engine';

const EngineService = {};

const fetchingEngines = () => ({
	type: C.FETCHING
});

const fetchedEngines = (payload) => ({
	type: C.FETCHED,
	payload
});

export const fetchEngines = () => (dispatch, getState) => {
	dispatch(fetchingEngines());

	EngineService.fetch({}, {
		token: getState().auth.token
	}).then(engines => {
		return dispatch(fetchedEngines(engines));
	});
};