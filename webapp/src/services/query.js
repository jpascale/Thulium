import { post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const sendQuery = (engine, query, options) => {
	const queryOptions = objectAssign({}, options,  { mediaType: 'application/pgsql' });
	return post(`/core/v1/${engine}/query`, query, queryOptions).then(extractBody);
}