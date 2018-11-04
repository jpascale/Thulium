import C from '../constants/app';
import { checkAuth, fetchProfile, anonymous } from './auth';
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
		return Promise.all([
			dispatch(fetchProfile()),
			dispatch(fetchEngines())
		]);
	}, err => {
		return dispatch(anonymous());
	}).then(() => {
		return dispatch(negotiateSession());
	}).then(() => {
		return dispatch(booted());
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