import C from '../constants/app';
import { fetchProfile } from './auth';
import { fetchEngines } from './engines';

import { hello, ws } from './session';

const booting = () => ({
	type: C.BOOTING
});

const booted = () => ({
	type: C.BOOTED
});

export const boot = () => (dispatch, getState) => {
	dispatch(booting());

	dispatch(
		hello()
	).then(() => {
		return Promise.all([
			dispatch(fetchProfile()),
			dispatch(fetchEngines())
		]);
	}).then(() => {
		return dispatch(booted());
	});
};

const running = () => ({
	type: C.RUNNING
});

export const doneRunning = (payload) => ({
	type: C.RUN,
	payload
});

export const run = payload => (dispatch, getState) => {

	dispatch(running());

	const query = {
		type: getState().app.engines[getState().app.currentEngine].slug,
		payload: {
			query: getState().app.files[getState().app.selectedFile].content
		}
	};

	ws().send(JSON.stringify(query));
};