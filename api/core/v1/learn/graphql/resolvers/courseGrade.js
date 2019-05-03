const superagent = require('superagent')
			, debug = require('debug')('api:core:v1:learn:gql:membership')

const BASE_URL = 'https://itba-test.blackboard.com/learn/api/public';

module.exports = {
	CourseGrade: {
		content: ({ id, contentId }, args, req) => new Promise((resolve, reject) => {
			if (!contentId) return resolve(null);
			superagent
			.get(`${BASE_URL}/v1/courses/${req.courseId}/contents/${contentId}`)
			.set('Authorization', req.headers.authorization)
			.end((err, response) => {
				if (err) {
					console.error(err);
					return reject(err);
				}
				// debug(response.body);
				if (response.body.description === 'Thulium Exam') {
					return resolve(response.body);
				}
				resolve(null);
			});
		})
	}
}