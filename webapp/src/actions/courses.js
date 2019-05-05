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
