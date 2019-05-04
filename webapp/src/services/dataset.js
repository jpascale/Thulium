import { get, post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';


export const upload = (data) => {
  return post(`/core/v1/datasets/create`, { data }).then(extractBody);
};

export const create = (data, options) => {
	const queryOptions = objectAssign({}, options);
	return post(`/core/v1/datasets`, data, queryOptions).then(extractBody);
};

export const fetchAll = (data, options) => {
	const queryOptions = objectAssign({}, options);
	return get(`/core/v1/datasets/all`, data, queryOptions).then(extractBody);
};
