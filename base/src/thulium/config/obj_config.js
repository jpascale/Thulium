
const fs = require('fs');
const process = require('process');
const path = require('path');
const projectPath = require('path').basename(__dirname);

let filename = "app.json";
let credentialFilename = "app.secure.json";

let file = JSON.parse(fs.readFileSync(path.resolve(__dirname, filename), 'utf8'));
let credential = JSON.parse(fs.readFileSync(path.resolve(__dirname, credentialFilename), 'utf8'));
let environment = process.env.NODE_ENV || "development";
config = {
    ...file[environment],
    ...credential[environment]
};

module.exports = config;
