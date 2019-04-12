const fs = require('fs')
		, path =require('path')
		, { mergeResolvers } = require('merge-graphql-schemas')
		, index = 'index.js';

const resolvers = fs.readdirSync(__dirname).filter(f => path.basename(f) !== index).map(f => {
	return require(`./${f}`);
});

module.exports = mergeResolvers(resolvers);