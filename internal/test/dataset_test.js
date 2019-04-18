const { MongoMemoryServer } = require('mongodb-memory-server'),
  User = require('../controllers/user'),
  Dataset = require('../controllers/dataset'),
  mongoose = require('mongoose');

const mongooseOpts = {
  autoReconnect: true,
  reconnectTries: 100,
  reconnectInterval: 1000,
  useNewUrlParser: true
};

describe('dataset data type tests ', () => {


  let mongod;
  let uri;

  beforeAll(async (done) => {
    // TODO: Modularize
    mongod = new MongoMemoryServer();
    uri = await mongod.getConnectionString();
    mongoose.connect(uri, mongooseOpts);
    mongoose.connection.once('open', () => done());
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

describe('dataset instance method tests', () => {

  let mongod;
  let uri;
  let dataset;
  let user;

  beforeAll(async (done) => {
    // TODO: Modularize
    mongod = new MongoMemoryServer();
    uri = await mongod.getConnectionString();
    mongoose.connect(uri, mongooseOpts);
    mongoose.connection.once('open', () => done());
  });

  afterAll(() => {
    mongoose.disconnect();
    mongod.stop();
  });

  it('should create a dataset table correctly', async (done) => {

    user = new User({
      email: 'email@example.xyz',
      role: 'admin',
      hash: 'hash',
      salt: 'salt'
    });
    await user.save();

    dataset = new Dataset({
      title: 'exampleDataset',
      publisher: user._id,
      paradigm: 'sql',
      access: 'owner'
    });
    await dataset.save();

    const columns = [
      {
        name: 'id',
        data_type: 'int',
        options: {
          fk: true,
          nullable: false
        }
      },
      {
        name: 'name',
        data_type: 'string',
      },
      {
        name: 'age',
        data_type: 'int'
      }
    ];

    const values = [{
      id: 1,
      name: 'Juan',
      age: 24
    },
    {
      id: 2,
      name: 'Roberto',
      age: 50
    }];

    dataset.createTable('exampleTable', columns, values, (err, res) => {
      if (err) {
        console.error(err);
        throw new Error('Dataset table creation failed');
      }

      expect(res.table_name).toEqual('exampleTable');
      expect(res.columns[0].name).toEqual(columns[0].name);
      expect(res.values[0].id).toEqual(values[0].id);
      done();
    });

  });

  it('should correctly get the tables', (done) => {
    dataset.getTables((err, res) => {
      expect(res[0].table_name).toEqual('exampleTable');
      done();
    });
  });

});


describe('dataset static method tests', () => {
  let mongod;
  let uri;
  let dataset;
  let dataset2;
  let user;

  beforeAll(async (done) => {
    // TODO: Modularize
    mongod = new MongoMemoryServer();
    uri = await mongod.getConnectionString();
    mongoose.connect(uri, mongooseOpts);
    mongoose.connection.once('open', () => done());
  });

  it('should get datasets by user', async (done) => {
    const user = new User({
      email: 'email@example.xyz',
      role: 'admin',
      hash: 'hash',
      salt: 'salt'
    });
    await user.save();

    dataset = new Dataset({
      title: 'exampleDataset',
      publisher: user._id,
      paradigm: 'sql',
      access: 'owner'
    });
    await dataset.save();

    dataset2 = new Dataset({
      title: 'exampleDataset2',
      publisher: user._id,
      paradigm: 'sql',
      access: 'owner'
    });
    await dataset2.save();

    Dataset.byUser(user, (err, res) => {
      if (err) throw err;
      expect(res[0].getTitle()).toEqual(dataset.title);
      expect(res[1].getTitle()).toEqual(dataset2.title);
      done();
    })
  });

});