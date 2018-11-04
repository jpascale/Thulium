module.exports = {
  PostgresStorage: require('./storage/postgres_storage'),
  MongoStorage: require('./storage/mongo_storage'),
  userModel: require('./models/users')
};