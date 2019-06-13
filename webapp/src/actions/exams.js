import C from '../constants/exams';
import * as ExamService from '../services/exams';
import { startSession, connectUsingToken } from './session';

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
	dispatch(examMode(true));

	return connectUsingToken(getState().auth.token, {
		onMessage: data => {
			console.log(data);
		// dispatch(doneRunning(data));
		}
	}).then(() => {
		console.log('connected to ws');
		return ExamService.loadExam(examId, {
			token: getState().auth.token
		});
	}).then(session => {

		const { expect } = session;
		console.log(expect);


		return dispatch(startSession(session));	
	});;

	
};