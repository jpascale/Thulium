import superagent from 'superagent';

console.log(process.env);

const request = (path, body = {}, options = {}, method = 'post') => {
	const baseRequest = superagent[method]
		.url(`${SERVICE_URL}${path}`)
		.set('Authorization', `Bearer ${options.token}`)
		.set('Content-Type', options.mediaType || 'application/json')
		.set('Accept', 'application/json')
		.ok(res => res.statusCode < 400);
	if (method === 'get') {
		return baseRequest.query(body);
	}
	return baseRequest.send(body);
};

export default request;

export const post = request;
export const get = (path, query, options) => request(path, query, options, 'get');
export const patch = (path, body, options) => request(path, body, options, 'patch');
export const put = (path, body, options) => request(path, body, options, 'put');

export const extractBody = res => res.body;