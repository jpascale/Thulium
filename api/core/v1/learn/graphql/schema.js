const { makeExecutableSchema } = require('graphql-tools')
		, typeDefs = require('./types/')
		, resolvers = require('./resolvers/');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;