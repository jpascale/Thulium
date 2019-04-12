const superagent = require('superagent')
			, debug = require('debug')('api:core:v1:learn:gql:membership')

const BASE_URL = 'https://itba-test.blackboard.com/learn/api/public';

module.exports = {
	Query: {
		memberships: (root, args, req) => new Promise((resolve, reject) => {
			debug(req.headers);
			superagent
			.get(`${BASE_URL}/v1/users/${req.user.db.bb_id}/courses`)
			.type('form')
			.set('Authorization', req.headers.authorization)
			.query({
				limit: 200
			})
			.end((err, response) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				resolve(response.body.results);
			});
		})
	}
}