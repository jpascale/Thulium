import { post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';

export const createFile = (file, options) => {
	return post(`/core/v1/files`, file, options).then(extractBody);
}