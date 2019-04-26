const Storages = require('./storages');

module.exports = {
	...Storages,
	StorageService: require('./service')
};