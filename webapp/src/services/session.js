import { post, get } from './queryBuilder';
import objectAssign from 'object-assign';

export const hello = (sessionId, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/session/hello/${sessionId}`, {}, queryOptions).then(res => ({
		session: res.body,
		token: res.header['x-api-token'],
		ws: res.header.location
	}));
}

export const fetchSession = (options) => {
	const queryOptions = objectAssign({}, options);
	return get(`/core/v1/session/mine`, {}, queryOptions);
}