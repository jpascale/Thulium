import C from '../constants/app';
import { fetchEngines } from './engines';
import { fetchCourses } from './courses';
import { fetchSession } from './session';
import { fetchDatasets, fetchDatasetInstances } from './datasets';
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
		return Promise.all([
			dispatch(bootExam(params.exam)),
			dispatch(fetchEngines()),
			dispatch(fetchDatasets()),
		]);
	}

	dispatch(booting());

	Promise.all([
		dispatch(fetchEngines()),
		dispatch(fetchCourses()),
		dispatch(fetchSession()),
		dispatch(fetchDatasets()),
		// dispatch(fetchDatasetInstances())
	]).then(() => {
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

export const runFailed = payload => (dispatch, getState) => {
	dispatch({
		type: C.RUN_FAILED,
		payload
	});
	dispatch(notify({
		text: 'Query failed, check result box to see why',
		type: 'danger'
	}));
};

export const run = (explain) => (dispatch, getState) => {

	if (getState().app.running) {
		dispatch(notify({
			text: 'A query is already running. Press "Stop" to halt its execution',
			type: 'warning'
		}))
		return;
	}

	dispatch(running());
	dispatch(notify({
		text: 'Sending query',
		type: 'info'
	}));

	const query = {
		action: 'execute-query',
		data: {
			file: getState().app.selectedFile,
			content: (explain ? 'explain ' : '') + getState().app.files[getState().app.selectedFile].content
		}
	};

	ws().send(query);
};

export const stop = () => (dispatch, getState) => {
	dispatch(notify({
		text: 'Stopped Query',
		type: 'primary'
	}));
	dispatch({
		type: C.STOP
	});
};

export const explain = () => run(true);

export const notify = notification => (dispatch, getState) => {
	const id = Math.random().toString(36).substr(2);
	const notif = Object.assign({}, notification, { id });
	dispatch({
		type: C.NOTIFY,
		payload: notif
	});

	if (notification.delay === -1) return;

	setTimeout(() => {
		dispatch(closeNotification(id));
	}, notification.delay || 2000);
	
};

export const closeNotification = id => ({
	type: C.CLOSE_NOTIFICATION,
	payload: id
});

const startsWith = (str, start) => str.substr(0, start.length) === start;
const endsWith = (str, end) => str.substr(-end.length) === end;

export const wsMessageHandler = ({ getState, dispatch }) => ({ topic, message }) => {
	console.log({ topic, message });
	if (!startsWith(topic, 'execute query')) return;
	if (endsWith(topic, 'error')) {
		dispatch(runFailed(message.error));
		return;
	}
	if (getState().app.stop) {
		return;
	}
	dispatch(notify({
		text: 'Query results are ready',
		type: 'success'
	}));
	dispatch(doneRunning(message.result));
};
