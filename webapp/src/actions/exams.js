import C from '../constants/exams';
import * as ExamService from '../services/exams';
import { startSession, connectUsingToken, ws } from './session';
import { wsMessageHandler } from './app'

const creatingExam = () => ({
	type: C.CREATING
});

const createdExam = (payload) => ({
	type: C.CREATED,
	payload
});

export const createExam = (course, exam) => (dispatch, getState) => {
	dispatch(creatingExam());

	return ExamService.createExam(course, exam, {
		token: getState().auth.token
	}).then(exam => {
		return dispatch(createdExam(exam));
	});
};

const examMode = on => ({
	type: C.SET_EXAM_MODE,
	payload: on
});

export const loadExam = examId => (dispatch, getState) => {
	dispatch(examMode(examId));

	const thuliumWebSocket = connectUsingToken(getState().auth.token);
	ws(thuliumWebSocket);
	const createdDatasets = [];
	return new Promise((resolve, reject) => {
		const messageHandler = ({ topic, message }) => {
			if (topic !== 'create dataset instance') return;
			createdDatasets.push(message.id);
		};
		thuliumWebSocket.on('connected', () => {
			console.log('connected to ws');
			ExamService.loadExam(examId, {
				token: getState().auth.token
			}).then(session => {

				if (session.expect.length === createdDatasets.length) {
					dispatch(startSession(session));
					return resolve();
				}

				thuliumWebSocket.removeListener('message', messageHandler);
				const handler = ({ topic, message }) => {
					if (topic !== 'create dataset instance') return;
					createdDatasets.push(message.id);
					if (session.expect.length === createdDatasets.length) {
						dispatch(startSession(session));
						thuliumWebSocket.removeListener('message', handler);
						return resolve();
					}
				};
				thuliumWebSocket.on('message', handler);
			});
		});
		thuliumWebSocket.on('message', messageHandler);
		thuliumWebSocket.on('message', wsMessageHandler({ getState, dispatch }));
		thuliumWebSocket.connect();
	});
};

const submittingExamResponse = () => ({
	type: C.SUBMITTING
});

const submittedExamResponse = (payload) => ({
	type: C.SUBMITTED,
	payload
});

export const submitExamResponse = () => (dispatch, getState) => {
	dispatch(submittingExamResponse());

	const file = getState().app.files[getState().app.selectedFile];

	return ExamService.submitResponse(getState().app.examMode, file.question, {
		response: (() => {
			if (file.type === 'true-false') return file.response;
			if (file.type === 'multiple-choice') return file.response;
			if (file.type === 'written-answer') return file.response;
			if (file.type === 'query-response') return file.content;
		})()
	}, {
		token: getState().auth.token
	}).then(response => {
		return dispatch(submittedExamResponse(response));
	});
};

export const fetchResponses = exam => (dispatch, getState) => {
	return ExamService.fetchResponses(exam, {
		token: getState().auth.token
	});
};
