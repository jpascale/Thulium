
const fs = require('fs');
const process = require('process');
const path = require('path');
const configPath = process.cwd() + '/../config/'
let filename = "app.json";
console.log();
let credentialFilename = "app.secure.json";

let file = JSON.parse(fs.readFileSync(path.resolve(configPath, filename), 'utf8'));
let credential = JSON.parse(fs.readFileSync(path.resolve(configPath, credentialFilename), 'utf8'));
let environment = process.env.NODE_ENV || "development";
config = {
    ...file[environment],
    ...credential[environment]
};

module.exports = config;
