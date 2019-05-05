import { post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const createExam = (course, exam, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/learn/v1/courses/${course}/contents/createAssignment`, exam, queryOptions).then(extractBody);
}

export const loadExam = (id, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/exams/${id}/load`, {}, queryOptions).then(extractBody);
}
