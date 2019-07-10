import C from '../constants/exams';
import * as ExamService from '../services/exams';
import { startSession, connectUsingToken, ws } from './session';
import { wsMessageHandler, notify } from './app'

const creatingExam = () => ({
	type: C.CREATING
});

const createdExam = (payload) => ({
	type: C.CREATED,
	payload
});

export const createExam = (course, exam) => (dispatch, getState) => {
	dispatch(creatingExam());

	dispatch(notify({
		text: 'Creating exam',
		type: 'info'
	}));

	return ExamService.createExam(course, exam, {
		token: getState().auth.token
	}).then(exam => {
		dispatch(notify({
			text: 'Created exam successfully',
			type: 'success'
		}));
		return dispatch(createdExam(exam));
	}).catch(err => {
		console.error(err);
		dispatch(notify({
			text: 'Failed to create exam. Please try again',
			type: 'danger'
		}));
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
		})(),
		file: file._id
	}, {
		token: getState().auth.token
	}).then(response => {
		dispatch(notify({
			text: 'Received successfully',
			type: 'success'
		}));
		return dispatch(submittedExamResponse(response));
	}, err => {
		dispatch(notify({
			text: 'There was an error. Please try again',
			type: 'danger'
		}));
		return err;
	});
};

export const fetchResponses = exam => (dispatch, getState) => {
	return ExamService.fetchResponses(exam, {
		token: getState().auth.token
	});
};

export const submitGrade = (column, user, grade) => (dispatch, getState) => {
	// dispatch(creatingExam());

	dispatch(notify({
		text: 'Sending grade',
		type: 'info'
	}));
	const course = getState().app.selectedCourse;
	return ExamService.submitGrade(course, column, user, {
		text: grade.toFixed(2),
		score: parseFloat(grade.toFixed(2))
	}, {
		token: getState().auth.token
	}).then(r => {
		dispatch(notify({
			text: 'Successfully sent grade',
			type: 'success'
		}));
		return r;
	}).catch(err => {
		console.error(err);
		dispatch(notify({
			text: 'Failed to send grade. Plase try again',
			type: 'danger'
		}));
	});
	// .then(exam => {
	// 	return dispatch(createdExam(exam));
	// });
};

export const reviewResponse = (response, review) => (dispatch, getState) => {
	dispatch(notify({
		text: 'Saving',
		type: 'info'
	}));
	return ExamService.reviewResponse(response, { review }, {
		token: getState().auth.token
	}).then(() => {
		dispatch(notify({
			text: 'Saved',
			type: 'success'
		}));
	}).catch(err => {
		console.error(err);
		dispatch(notify({
			text: 'Failed to save. Please try again later',
			type: 'danger'
		}));
	});
};
