import C from '../constants/course';
import * as CourseService from '../services/courses';

export const changeCourse = course => ({
	type: C.CHANGE,
	payload: course
});

const fetchingCourses = () => ({
	type: C.FETCHING
});

const fetchedCourses = (payload) => ({
	type: C.FETCHED,
	payload
});

export const fetchCourses = () => (dispatch, getState) => {
	dispatch(fetchingCourses());

	return CourseService.fetchAll({}, {
		token: getState().auth.token
	}).then(courses => {
		return dispatch(fetchedCourses(courses));
	})
	.catch(err => {
		return dispatch(fetchedCourses({
			memberships: []
		}))
	});
};

const creatingExam = () => ({
	type: C.CREATING_EXAM
});

const createdExam = (payload) => ({
	type: C.CREATED_EXAM,
	payload
});

export const createExam = (course, exam) => (dispatch, getState) => {
	dispatch(creatingExam());

	return CourseService.createExam(course, exam, {
		token: getState().auth.token
	}).then(exam => {
		return dispatch(createdExam(exam));
	});
};