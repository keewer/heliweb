const sql = require(__basename + '/lib/db/sql/sql.js')

class API {

	constructor() {}

	register(o) {
		return sql.registerSQL(o);
	}

	login(modelName, attrs, o) {
		return sql.findOne(modelName, attrs, o);
	}

	findOne(modelName, attrs, o){
		return sql.findOne(modelName, attrs, o);
	}

	//分页查询
	findAndCountAll(modelName, attrs, o, offset, limit) {
		return sql.findAndCountAll(modelName, attrs, o, offset, limit);
	}

}

module.exports = new API();