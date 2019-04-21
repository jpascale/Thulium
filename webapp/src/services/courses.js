import { post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const fetchAll = (query, options) => {
	const queryOptions = objectAssign({}, options);
	const graphqlQuery = {
		query: `
			query {
				memberships {
					courseRoleId,
					courseId,
					course {
						name
						grades {
							id
							name
							content {
								id
								title
								description
							}
						}
						contents {
							id
							title
						}
					}
				}
			}`
	};
	return post(`/core/v1/learn/graphql`, graphqlQuery, queryOptions).then(extractBody).then(body => body.data);
}

export const createExam = (course, exam, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/learn/v1/courses/${course}/contents/createAssignment`, exam, queryOptions).then(extractBody);
}