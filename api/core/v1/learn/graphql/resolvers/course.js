const superagent = require('superagent')
			, debug = require('debug')('api:core:v1:learn:gql:membership')

const BASE_URL = 'https://campus.itba.edu.ar/learn/api/public';

module.exports = {
	Course: {
		grades: ({ id, }, args, req) => new Promise((resolve, reject) => {
			superagent
			.get(`${BASE_URL}/v2/courses/${id}/gradebook/columns`)
			.set('Authorization', req.headers.authorization)
			.end((err, response) => {
				if (err) {
					// console.error(err);
					return resolve([]);
					// return reject(err);
				}
				req.courseId = id;
				
				// const grades = response.body.results.filter(g => g.contentId);
				// debug(grades);
				resolve(response.body.results);
			});
		}),
		contents: ({ id, }, args, req) => new Promise((resolve, reject) => {
			superagent
			.get(`${BASE_URL}/v1/courses/${id}/contents`)
			.set('Authorization', req.headers.authorization)
			.end((err, response) => {
				if (err) {
					// console.error(err);
					return reject(err);
				}
				// debug(response.body.results);
				resolve(response.body.results);
			});
		})
	}
}