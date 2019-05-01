import C from '../constants/app';
import { fetchProfile } from './auth';
import { fetchEngines } from './engines';
import { fetchCourses } from './courses';
import { fetchSession } from './session';

import { hello, ws } from './session';

const booting = () => ({
	type: C.BOOTING
});

const booted = () => ({
	type: C.BOOTED
});

export const boot = () => (dispatch, getState) => {
	dispatch(booting());

	Promise.all([
		dispatch(fetchEngines()),
		dispatch(fetchCourses()),
		dispatch(fetchSession())
	]).then(() => {
		return dispatch(booted());
	});


	// dispatch(
	// 	hello()
	// ).then(() => {
	// 	return Promise.all([
	// 		dispatch(fetchProfile()),
	// 		dispatch(fetchEngines()),
	// 		dispatch(fetchCourses()),
	// 		dispatch(fetchSession())
	// 	]);
	// }).then(() => {
	// 	return dispatch(booted());
	// });
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
		type: getState().app.currentEngine,
		payload: {
			query: getState().app.files[getState().app.selectedFile].content
		}
	};

	ws().send(JSON.stringify(query));
};