import { post, patch, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const createFile = (file, options) => {
	return post(`/core/v1/files`, file, options).then(extractBody);
}

export const update = (file, delta, options) => {
	return patch(`/core/v1/files/${file}`, delta, options).then(extractBody);
}