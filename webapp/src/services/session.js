import { post } from './queryBuilder';
import objectAssign from 'object-assign';

export const hello = (sessionId, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/session/hello/${sessionId}`, {}, queryOptions).then(res => {
		console.log(res);
		return {
			session: res.body,
			token: res.header['x-api-token'],
			ws: res.header.location
		}
	});
}