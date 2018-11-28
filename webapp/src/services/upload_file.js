import { get, post, extractBody } from './queryBuilder';
import objectAssign from 'object-assign';


export const upload = (data) => {
  return post(`/core/v1/datasets/create`, { data }).then(extractBody);
}