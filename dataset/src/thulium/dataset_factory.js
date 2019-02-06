const { Dataset } = require('@thulium/internal')
  , { DatasetManager } = require('./dataset_manager');

DatasetFactory = {};

/**
 * @param data
 * @param user Mongo user object
 * @callback cb
 */
DatasetFactory.create = (data, user, cb) => {

  if (!data) throw new Error('Data must be provided');
  if (!data.title || !data.paradigm || !data.access) throw new Error('Data must contain title, paradigm and access.')
  if (!user) throw new Error('User must be provided.');

  const dataset = new Dataset({
    title: data.title,
    publisher: user._id,
    paradigm: data.paradigm,
    access: data.access
  });
  if (cb) {
    dataset.save().then((res) => cb(null, new DatasetManager(res))).catch((err) => cb(err));
  } else {
    return new Promise((resolve, reject) => {
      dataset.save()
        .then(res => resolve(new DatasetManager(res)))
        .catch(err => reject(err));
    });
  }
};

/**
 * @param user Mongo user object.
 */
DatasetFactory.getDatasetsByUser = (user, cb) => {
  if (!user) throw new Error('User must be provided.');
  if (cb) {
    Dataset.find({ publisher: user }, (err, res) => {
      if (err) return cb(err);
      cb(null, res.map(ds => new DatasetManager(ds)));
    });
  } else {
    return new Promise((resolve, reject) => {
      Dataset.find({ publisher: user }, (err, res) => {
        if (err) return reject(err);
        resolve(res.map(ds => new DatasetManager(ds)));
      });
    });
  }
}

//getPublicDatasets

module.exports = DatasetFactory;