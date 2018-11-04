import { get, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const fetchAll = (query, options) => {
	const queryOptions = objectAssign({}, options);
	return get(`/core/v1/engines`, query, queryOptions).then(extractBody);
}