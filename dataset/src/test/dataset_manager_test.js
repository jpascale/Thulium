const { MongoMemoryServer } = require('mongodb-memory-server')
  , mongoose = require('mongoose')
  , { DatasetManager } = require('../thulium/dataset_manager')
  , { User, Dataset, DatasetTable } = require('@thulium/internal');

describe('dataset manager test', () => {

  let mongod;
  let uri;
  let user;
  let dataset;

  beforeAll(async (done) => {
    mongod = new MongoMemoryServer();
    uri = await mongod.getConnectionString();
    await User.base.connect(uri, { useNewUrlParser: true });

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

    done();
  });

  afterAll(async (done) => {
    await User.base.disconnect();
    await mongod.stop();
    done();
  });

  it('should create a dataset table correctly', (done) => {

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

    const manager = new DatasetManager(dataset);
    manager.createTable('exampleTable', columns, values, (err, res) => {
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
    new DatasetManager(dataset).getTables((err, res) => {
      expect(res[0].table_name).toEqual('exampleTable');
      done();
    });
  });


});