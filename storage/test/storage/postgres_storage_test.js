const PostgresStorage = require('../../thulium/storage/postgres_storage');

describe('Postgres storage', () => {

  let pool;
  let storage;

  beforeEach(() => {

    pool = {
      connect: jest.fn(),
      query: jest.fn((queryStr, cb) => {
        if (cb) {
          return cb({ input: queryStr });
        }

        return Promise.resolve({ input: queryStr })
      })
    };
    storage = new PostgresStorage({}, pool);
  });

  test('should connect to database', (done) => {
    storage.connect();
    expect(pool.connect).toBeCalledTimes(1);
    done();
  });

  test('should execute callback', (done) => {
    const query = 'SELECT NOW()';
    const cb = (res) => {
      expect(res.input).toBe(query);
      done();
    }
    storage.query(query, cb);
    expect(pool.query).toBeCalledTimes(1);
  });

  test('should execute promise', async () => {
    const query = 'SELECT NOW()';
    const res = await storage.query(query);
    expect(res.input).toBe(query);
    expect(pool.query).toBeCalledTimes(1);
  });

});