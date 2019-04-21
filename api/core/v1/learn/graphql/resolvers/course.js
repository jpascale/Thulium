const superagent = require('superagent')
			, debug = require('debug')('api:core:v1:learn:gql:membership')

const BASE_URL = 'https://itba-test.blackboard.com/learn/api/public';

module.exports = {
	Course: {
		grades: ({ id, }, args, req) => new Promise((resolve, reject) => {
			superagent
			.get(`${BASE_URL}/v2/courses/${id}/gradebook/columns`)
			.set('Authorization', req.headers.authorization)
			.end((err, response) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				debug(response.body.results);
				resolve(response.body.results);
			});
		}),
		contents: ({ id, }, args, req) => new Promise((resolve, reject) => {
			superagent
			.get(`${BASE_URL}/v1/courses/${id}/contents`)
			.set('Authorization', req.headers.authorization)
			.end((err, response) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				debug(response.body.results);
				resolve(response.body.results);
			});
		})
	}
}