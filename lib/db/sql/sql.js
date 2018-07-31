class SQL {

	constructor() {}

	registerSQL(o) {
		return model.User.create({
			email: o.email,
			pwd: o.pwd
		})
	}

	findOne(modelName, attrs, o, t) {
		//ModelName: 模型名称
		//attrs: 查找字段数组
		//o: 条件对象
		return t ? model[modelName].findOne({
			attributes: attrs,
			where: o,
			transaction: t
		}) : model[modelName].findOne({
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
	update(modelName, attrs, condition, t) {
		//modelName: 模型名称
		//attrs: 更新字段对象
		//condition: 条件对象 {id: 2}
		//t: 事务
		return t ? model[modelName].update(attrs, {
			where: condition
		}, t) : model[modelName].update(attrs, {
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
		//offset: 偏移几条数据
		//limit: 查询几条数据
		//order: [['id', 'DESC']], 排序规则
		return model[modelName].findAll({
			attributes: attrs,
			where: o,
			offset: offset,
			limit: limit,
			order: order
		});
	}

	//查询所有数据
	findAlling(modelName, attrs, o, t) {
		//ModelName: 模型名称
		//attrs: 查找字段数组 ['a', 'b']
		//o: 条件对象 {a: 1}
		return t ? model[modelName].findAll({
			attributes: attrs,
			where: o,
			transaction: t
		}) : model[modelName].findAll({
			attributes: attrs,
			where: o
		});
	}

	//添加数据
	create(modelName, o) {
		//modelName: 模型名称
		//o: 插入数据对象 {a: 1, b: 2}
		return model[modelName].create(o);
	}

	//获取最大值
	max(modelName, field) {
		//modelName: 模型名称
		//field: 字段 'a'
		return model[modelName].max(field);
	}

	query(sql, o) {
		return o ? sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT,
			replacements: o
		}) : sequelize.query(sql, {
			type: sequelize.QueryTypes.SELECT
		});
	}

	destroy(modelName, o){
		return model[modelName].destroy({
			where: o,
			force: true
		});
	}

	//收货成功, 判断该分销商是否达到升级为总代理, 事务处理
	transaction(fn) {
		return sequelize.transaction(fn);
	}

	//求和
	sum(modelName, field, o) {
		//modelName: 模型名称
		//field: 字段 'id'
		//o: 条件对象 {id: 2}
		return model[modelName].sum(field, {
			where: o
		});
	}

}


module.exports = new SQL();