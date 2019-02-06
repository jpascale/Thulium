const { MongoMemoryServer } = require('mongodb-memory-server')
  , mongoose = require('mongoose')
  , DatasetFactory = require('../thulium/dataset_factory')
  , { User } = require('@thulium/internal');

describe('dataset factory test', () => {

  let mongod;
  let uri;

  beforeAll(async (done) => {
    mongod = new MongoMemoryServer();
    uri = await mongod.getConnectionString();
    await User.base.connect(uri, { useNewUrlParser: true });
    done();
  });

  afterAll(async (done) => {
    await User.base.disconnect();
    await mongod.stop();
    done();
  });

  it('should create a dataset manager using callback', async (done) => {
    const user = new User({
      email: 'email@example.xyz',
      role: 'admin',
      hash: 'hash',
      salt: 'salt'
    });
    await user.save();

    const data = {
      title: 'exampleDataset',
      paradigm: 'sql',
      access: 'owner'
    };

    DatasetFactory.create(data, user, (err, res) => {
      if (err) throw err;
      expect(res.getTitle()).toEqual(data.title);
      done();
    })
  });

  it('should create a dataset using promise', async (done) => {
    const user = new User({
      email: 'email@example.xyz',
      role: 'admin',
      hash: 'hash',
      salt: 'salt'
    });
    await user.save();

    const data = {
      title: 'exampleDataset',
      paradigm: 'sql',
      access: 'owner'
    };

    const dataset = await DatasetFactory.create(data, user);
    expect(dataset.getTitle()).toEqual(data.title);
    done();
  });

  it('should get user datasets using callback', async (done) => {
    const user = await User.findOne({ email: 'email@example.xyz' });
    DatasetFactory.getDatasetsByUser(user, (err, res) => {
      if (err) throw new Error(err);
      expect(res[0].getTitle()).toEqual('exampleDataset');
      done();
    });
  });

  it('should get user datasets using promise', async (done) => {
    const user = await User.findOne({ email: 'email@example.xyz' });
    const datasetManagers = await DatasetFactory.getDatasetsByUser(user);
    expect(datasetManagers.map(ds => ds.getTitle())).toEqual(['exampleDataset']);
    done();
  });
})