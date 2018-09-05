const fs = require('fs');

class ObjConfig {
    config;
    credential_filename;


    filename;

    constructor(filename, credential_filename) {
        if (!filename)
            filename = "../../../app.json";
        if (!credential_filename)
            credential_filename = "../../../app.secure.json";
        this.filename = filename;
        this.credential_filename = credential_filename;
    }

    async get_config() {
        if(!this.config){
            let file = JSON.parse(fs.readFileSync(this.filename, 'utf8'));
            let credential = JSON.parse(fs.readFileSync(this.credential_filename, 'utf8'));
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