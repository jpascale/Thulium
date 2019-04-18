const fs = require('fs')
		, path = require('path')
		, { mergeTypes } = require('merge-graphql-schemas')
		, extension = '.graphql';

const typeDefs = fs.readdirSync(__dirname).filter(f => path.extname(f) === extension).map(f => {
	return fs.readFileSync(path.join(__dirname, f)).toString();
});

module.exports = mergeTypes(typeDefs, { all: true });