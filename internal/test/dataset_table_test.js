const { MongoMemoryServer } = require('mongodb-memory-server'),
  User = require('../controllers/user'),
  Dataset = require('../controllers/dataset'),
  DatasetTable = require('../controllers/dataset_table'),
  mongoose = require('mongoose');

describe('dataset tests', () => {

  let mongod;

  beforeAll(async (done) => {
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

  it('should save a dataset tables correctly', async (done) => {

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

    const tableColumns = [
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

    const table1 = new DatasetTable({
      dataset: dataset._id,
      table_name: 'table1',
      columns: tableColumns,
      values
    });
    await table1.save();

    const table2 = new DatasetTable({
      dataset: dataset._id,
      table_name: 'table2',
      columns: tableColumns,
      values
    })
    await table2.save();

    DatasetTable.find({ dataset: dataset._id }, (err, res) => {
      expect(res.map(o => o.table_name)).toEqual(['table1', 'table2']);
      done();
    });
  });

});