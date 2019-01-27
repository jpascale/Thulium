const { MongoMemoryServer } = require('mongodb-memory-server')
  , mongoose = require('mongoose');

describe('dataset creator test', () => {

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

  it('should create a dataset correctly', () => { });

})