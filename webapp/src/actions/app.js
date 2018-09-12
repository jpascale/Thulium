import C from '../constants/app';

export const changeEngine = engine => ({
	type: C.CHANGE_ENGINE,
	payload: engine
});

const running = () => ({
	type: C.RUNNING
});

const doneRunning = () => ({
	type: C.RUN
});

export const run = payload => (dispatch, getState) => {

	dispatch(running())

	setTimeout(() => {
		dispatch(doneRunning());
	}, 5000);
};

export const queryChanged = sql => ({
	type: C.QUERY_CHANGED,
	payload: sql
});