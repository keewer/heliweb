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

}


module.exports = new SQL();