const configObj = require("../config/obj_config");

let config = new configObj();

async
const qq = await config.get_config();

console.log( await config.get_config())