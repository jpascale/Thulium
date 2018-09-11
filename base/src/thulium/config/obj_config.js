const fs = require('fs');
const process = require('process');

class ObjConfig {

    constructor(filename, credentialFilename) {
        this.filename = filename || "../config/app.json";
        this.credentialFilename = credentialFilename || "../config/app.secure.json";
    }

    async get_config() {
        if(!this.config){
            let file = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
            let credential = JSON.parse(fs.readFileSync(this.credentialFilename, 'utf8'));
            this.config = {
                ...file[process.env.NODE_ENV],
                ...credential[process.env.NODE_ENV]
            };
            console.log(this.config);
        }
        return this.config;
    }


}

module.exports = ObjConfig;