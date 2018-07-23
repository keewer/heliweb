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

	//更新字段
	update(modelName, attrs, condition) {
		return sql.update(modelName, attrs, condition);
	}

}

module.exports = new API();