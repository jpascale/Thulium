import C from '../constants/app';
import { fetchEngines } from './engines';
import { fetchCourses } from './courses';
import { fetchSession } from './session';
import { fetchDatasets } from './datasets';
import { loadExam } from './exams';

import { hello, ws } from './session';

const booting = () => ({
	type: C.BOOTING
});

const booted = () => ({
	type: C.BOOTED
});

const params = location.search.substr(1).split('&').reduce((memo, val) => {
	const [key, value] = val.split('=');
	memo[key] = value;
	return memo;
}, {});

const bootExam = examId => (dispatch, getState) => {
	dispatch(booting());

	dispatch(loadExam(examId)).then(() => {
		return dispatch(booted());
	});
};

export const boot = () => (dispatch, getState) => {

	if (params.exam) {
		return dispatch(bootExam(params.exam));
	}

	dispatch(booting());

	Promise.all([
		dispatch(fetchEngines()),
		dispatch(fetchCourses()),
		dispatch(fetchSession()),
		dispatch(fetchDatasets())
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