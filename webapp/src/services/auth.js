import { get, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const fetchProfile = (options) => {
	const queryOptions = objectAssign({}, options);
	return get(`/core/v1/auth/profile`, {}, queryOptions).then(extractBody);
}