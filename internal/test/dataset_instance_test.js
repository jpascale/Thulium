const { MongoMemoryServer } = require('mongodb-memory-server'),
  User = require('../controllers/user'),
  Dataset = require('../controllers/dataset'),
  DatasetInstance = require('../controllers/dataset_instance'),
  Engine = require('../controllers/engine'),
  mongoose = require('mongoose');

  describe('dataset instance tests', () => {

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
      });

      it('should save a dataset instance correctly', (done) => {
        const user = new User({
            email: 'email@example.xyz',
            role: 'admin',
            hash: 'hash',
            salt: 'salt'
          });
          user.save();
          
          const dataset = new Dataset({
            title: 'exampleDataset',
            publisher: user._id,
            paradigm: 'sql',
            access: 'owner'
          });
          dataset.save();

          const engine = new Engine({
              title: 'postgres',
              slug: 'psql',
              mimeType: 'qwertyuiop'
          });
          engine.save();

          const datasetInstance = new DatasetInstance({
            title: 'testInstance',
            dataset: dataset._id,
            owner: user._id,
            engine: engine._id,
            tables: {
                'employees': 'employees_table_22494242984',
                'customers': 'customers_39sjsiu3udsjds'
            }
          });
          datasetInstance.save();

          DatasetInstance.findOne({title: 'testInstance'}, (result) => {
            expect(result.title).toEqual('testInstance');
            done();
          });
      });

  });