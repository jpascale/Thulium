const { Dataset } = require('@thulium/internal');
const CREATE_DATASET_INSTANCE = 'create dataset instance';
const debug = require('debug')('jobs:create-dataset-instance');

const job = ({ dataset, engine, owner, exam }, done) => {
	debug('fetching dataset %s', dataset);
	Dataset.findById(dataset, (err, dataset) => {
		if (err) return done(err);
		if (!dataset) return done(`failed to find dataset ${dataset}`);
		debug('creating instance');
		dataset.createInstances({ engine, owner, exam }, done);
	});
};

module.exports = {
	key: CREATE_DATASET_INSTANCE,
	job
};
