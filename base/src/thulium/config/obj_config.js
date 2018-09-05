const fs = require('fs');

class ObjConfig {
    config;
    credentialFilename;
    filename;

    constructor(filename, credentialFilename) {
        this.filename = filename || "./app.json";
        this.credentialFilename = credentialFilename || "./app.secure.json";
    }

    async get_config() {
        if(!this.config){
            let file = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
            let credential = JSON.parse(fs.readFileSync(this.credentialFilename, 'utf8'));
            this.config = {
                ...file,
                ...credential
            };
            console.log(this.config);
        }
        return this.config;
    }

}

module.exports = ObjConfig;