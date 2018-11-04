import { post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const hello = (sessionId, options) => {
	const queryOptions = objectAssign({}, options);
	return get(`/core/v1/engines`, query, queryOptions).then(extractBody);
}