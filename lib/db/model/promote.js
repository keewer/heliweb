const Sequelize = require('sequelize');

const Promote = sequelize.define(
	'promote', 
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			field: 'id',
			autoIncrement: true,
			allowNull: false,
			comment: '主键'
		},

		promoteCount: {
			type: Sequelize.INTEGER,
			field: 'promoteCount',
			allowNull: false,
			defaultValue: 0,
			comment: '分销商升级为总代理商品数量'
		}
	
	},
	{
		// 如果为 true 则表的名称和 model 相同，即 user
  	// 为 false MySQL 创建的表名称会是复数 users
  	// 如果指定的表名称本就是复数形式则不变
		freezeTableName: true,

		//自定义表名
		tableName: 'heli_promote',

		//是否需要增加createdAt、updatedAt、deletedAt字段
		timestamps: true,

		//取消createdAt字段
		// createdAt: false,

		//重命名createdAt
		createdAt: 'create_time',

		updatedAt: 'update_time',

		//同时需要设置paranoid为true（此种偏执模式下，删除数据时不会进行物理删除，而是设置deletedAt为当前时间
		'paranoid': true

		// engine: 'MYISAM'
	}
);


//创建表
// User.sync() 会创建表并且返回一个 Promise 对象
// 如果 force = true 则会把存在的表（如果 users 表已存在）先销毁再创建表
// 默认情况下 force = false
Promote.sync({force: false});

module.exports = Promote;