import { post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const sendQuery = (engine, query, options) => {
	const queryOptions = objectAssign({}, options,  { mediaType: 'application/pgsql' });
	return post(`/api/v1/query/${engine}`, query, queryOptions).then(extractBody);
}