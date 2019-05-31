const { Dataset } = require("@thulium/internal");
const CREATE_DATASET_INSTANCE = 'create dataset instance';

const job = ({ dataset, engine, owner }, done) => {
	Dataset.findById(dataset).exec((err, dataset) => {
		if (err) return done(err);
		dataset.createInstances({ engine, owner }, done);
	});
};

module.exports = {
	key: CREATE_DATASET_INSTANCE,
	job
}
