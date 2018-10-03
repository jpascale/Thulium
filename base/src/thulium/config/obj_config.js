const fs = require('fs')
		, path = require('path')
		, configPath = path.join(process.cwd(), '..', 'config')
		, filename = "app.json"
		, credentialFilename = "app.secure.json";

const file = JSON.parse(fs.readFileSync(path.resolve(configPath, filename), 'utf8'));
const credential = JSON.parse(fs.readFileSync(path.resolve(configPath, credentialFilename), 'utf8'));
const environment = process.env.NODE_ENV || "development";
config = {
	...file[environment],
	...credential[environment]
};

module.exports = config;
