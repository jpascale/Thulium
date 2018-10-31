import C from '../constants/app';
import { checkAuth, fetchProfile } from './auth';
import { fetchEngines } from './engines';

const booting = () => ({
	type: C.BOOTING
});

const booted = () => ({
	type: C.BOOTED
});

export const boot = () => (dispatch, getState) => {
	dispatch(booting());

	dispatch(
		checkAuth()
	).then(() => {
		if (getState().auth.authenticated) {
			return Promise.all([
				dispatch(fetchProfile()),
				dispatch(fetchEngines())
			]);
		}
		return Promise.resolve();
	}).then(() => {
		dispatch(booted());
	});
};

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