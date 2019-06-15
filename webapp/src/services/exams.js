import { post, patch, extractBody, get } from './queryBuilder';
import objectAssign from 'object-assign';

export const createExam = (course, exam, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/learn/v1/courses/${course}/contents/createAssignment`, exam, queryOptions).then(extractBody);
}

export const loadExam = (id, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/exams/${id}/load`, {}, queryOptions).then(extractBody);
}

export const submitResponse = (eid, qid, form, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/exams/${eid}/response/${qid}`, form, queryOptions).then(extractBody);
};

export const fetchResponses = (eid, options) => {
	const queryOptions = objectAssign({}, options);
	return get(`/core/v1/exams/${eid}/responses`, {}, queryOptions).then(extractBody);
};

export const submitGrade = (course, column, user, grade, options) => {
	const queryOptions = objectAssign({}, options);
	return patch(`/core/v1/learn/v2/courses/${course}/gradebook/columns/${column}/users/${user}`, grade, queryOptions).then(extractBody);
};
