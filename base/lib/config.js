const fs = require('fs')
		, path = require('path')
		, configPath = process.env.CONFIG_PATH || path.join(process.cwd(), '..', 'config')
		, filename = process.env.CONFIG || 'app.json'
		, credentialFilename = process.env.SECURE_CONFIG || 'app.secure.json'
		, defaultsDeep = require('lodash.defaultsdeep');

const file = JSON.parse(fs.readFileSync(path.resolve(configPath, filename), 'utf8'));
const credential = JSON.parse(fs.readFileSync(path.resolve(configPath, credentialFilename), 'utf8'));
const environment = process.env.NODE_ENV || 'development';
const config = defaultsDeep({}, file[environment], credential[environment]);

module.exports = config;
