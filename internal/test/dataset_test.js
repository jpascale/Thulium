const { MongoMemoryServer } = require('mongodb-memory-server'),
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
      console.log(`MongoDB successfully connected to ${uri}`);
      done();
    });

  });

  afterAll(() => {
    mongoose.disconnect();
    mongod.stop();
  })

  it('should pass', () => { });

});