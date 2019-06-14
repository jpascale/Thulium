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
							thuliumID
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
};
