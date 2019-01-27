const { MongoMemoryServer } = require('mongodb-memory-server'),
  User = require('../controllers/user'),
  Dataset = require('../controllers/dataset'),
  mongoose = require('mongoose');

describe('dataset tests', () => {

  let mongod;

  beforeAll(async (done) => {
    // TODO: Modularize
    mongod = new MongoMemoryServer();
    const uri = await mongod.getConnectionString();

    const mongooseOpts = {
      autoReconnect: true,
      reconnectTries: 100,
      reconnectInterval: 1000,
      useNewUrlParser: true
    };
    mongoose.connect(uri, mongooseOpts);

    mongoose.connection.once('open', () => {
      done();
    });

  });

  afterAll(() => {
    mongoose.disconnect();
    mongod.stop();
  });

  it('should save a dataset correctly', async (done) => {

    const user = new User({
      email: 'email@example.xyz',
      role: 'admin',
      hash: 'hash',
      salt: 'salt'
    });
    await user.save();

    const dataset = new Dataset({
      title: 'exampleDataset',
      publisher: user._id,
      paradigm: 'sql',
      access: 'owner'
    });

    await dataset.save();

    Dataset.findOne({ title: 'exampleDataset' }, (err, res) => {
      expect(res.title).toEqual('exampleDataset');
      done();
    });
  });

});