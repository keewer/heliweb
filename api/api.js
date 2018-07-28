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
	findAndCountAll(modelName, attrs, o) {
		return sql.findAndCountAll(modelName, attrs, o);
	}

	//更新字段
	update(modelName, attrs, condition) {
		//attrs ==> {id: 1, name: 2}
		//condition ==> {id: 1}
		return sql.update(modelName, attrs, condition);
	}

	//查询记录数
	count(modelName, o) {
		return sql.count(modelName, o);
	}

	//分页查询最新数据
	findAll(modelName, attrs, o, offset, limit, order) {
		return model[modelName].findAll({
			attributes: attrs,
			where: o,
			offset: offset,
			limit: limit,
			order: order
		});
	}

	//添加数据
	create(modelName, o) {
		return sql.create(modelName, o);
	}

	//获取最大值
	max(modelName, field) {
		return sql.max(modelName, field);
	}

	//原始查询
	query(s, o) {
		//s: 原始sql语句
		//o: 替换对象
		//SELECT * FROM projects WHERE status = :status;
		//replacements: { status: 'active' }
		return sql.query(s, o);
	}

}

module.exports = new API();