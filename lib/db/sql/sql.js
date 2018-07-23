class SQL {

	constructor() {}

	registerSQL(o) {
		return model.User.create({
			email: o.email,
			pwd: o.pwd
		})
	}

	findOne(modelName, attrs, o) {
		//ModelName: 模型名称
		//attrs: 查找字段数组
		//o: 条件对象
		return model[modelName].findOne({
			attributes: attrs,
			where: o
		});
	}


	//分页查询
	findAndCountAll(modelName, attrs, o, offset, limit){
		//ModelName: 模型名称
		//attrs: 查找字段数组
		//o: 条件对象
		return model[modelName].findAndCountAll({
			attributes: attrs,
			where: o,
			offset: offset,
			limit: limit
		});
	}

	//更新字段
	update(modelName, attrs, condition) {
		//modelName: 模型名称
		//attrs: 更新字段对象
		//condition: 条件对象 {字段名: {$}}
		return model[modelName].update(attrs, {
			where: condition
		});
	}


}


module.exports = new SQL();