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
	findAndCountAll(modelName, attrs, o){
		//ModelName: 模型名称
		//attrs: 查找字段数组
		//o: 条件对象
		return o ? model[modelName].findAndCountAll({attributes: attrs, where: o}) : model[modelName].findAndCountAll({attributes: attrs});
	}

	//更新字段
	update(modelName, attrs, condition) {
		//modelName: 模型名称
		//attrs: 更新字段对象
		//condition: 条件对象 {id: 2}
		return model[modelName].update(attrs, {
			where: condition
		});
	}


	//查询记录数
	count(modelName, o) {
		//modelName: 模型名称
		//o: 查询条件参数
		return o ? model[modelName].count({where: o}) : model[modelName].count();
	}

	//分页查询最新数据
	findAll(modelName, attrs, o, offset, limit, order){
		//ModelName: 模型名称
		//attrs: 查找字段数组 ['a', 'b']
		//o: 条件对象 {a: 1}
		//order: [['id', 'DESC']], 排序规则
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
		//modelName: 模型名称
		//o: 插入数据对象 {a: 1, b: 2}
		return model[modelName].create(o);
	}


}


module.exports = new SQL();