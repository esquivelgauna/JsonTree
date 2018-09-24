var query_builder = require('query_builder');
const os = require('os');
let addres = os.networkInterfaces();
let keys = Object.keys(addres);
//Local
if (addres[keys[1]][0].address == "::1") {
	database = {
		host: "localhost",
		user: "root",
		dbase: "db_niurons",
		pass: ""
	};
} else {
	database = {
		host: "niurons.com.mx",
		user: "niuronsc_Dev",
		pass: "**niuronsdev2017",
		dbase: "niuronsc_db_niurons"
	};
}
module.exports = new query_builder(database);