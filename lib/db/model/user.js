const Sequelize = require('sequelize');

const User = sequelize.define(
	'user', 
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			field: 'id',
			autoIncrement: true,
			allowNull: false,
			comment: '主键'
		},

		email: {
			type: Sequelize.STRING(32),
			field: 'email',
			allowNull: false,
			defaultValue: '',
			comment: '用户邮箱'
		},

		pwd: {
			type: Sequelize.STRING(32),
			field: 'pwd',
			allowNull: false,
			comment: '用户密码'
		},

		username:{
			type: Sequelize.STRING(20),
			field: 'username',
			allowNull: false,
			defaultValue: '',
			comment: '用户真实姓名'
		},

		phone: {
			type: Sequelize.CHAR(11),
			field: 'phone',
			allowNull: false,
			unique: true,
			defaultValue: '',
			comment: '用户手机号'
		},

		idcard: {
			type: Sequelize.CHAR(18),
			field: 'idcard',
			allowNull: false,
			unique: true,
			defaultValue: '',
			comment: '用户身份证'
		},

		flag: {
			type: Sequelize.STRING(40),
			field: 'flag',
			allowNull: false,
			defaultValue: '',
			comment: '登录标识'
		},

		auth: {
			type: Sequelize.TINYINT(1),
			field: 'auth',
			allowNull: false,
			defaultValue: -1,
			comment: '权限0总经理1营销总监2客服3总代理'
		},

		lastLoginTime: {
			type: Sequelize.DATE,
			field: 'lastLoginTime',
			allowNull: true,
			comment: '最后一次登录时间',
		},

		loginCount: {
			type: Sequelize.INTEGER,
			field: 'loginCount',
			allowNull: false,
			defaultValue: 0,
			comment: '登录次数'
		},

		address: {
			type: Sequelize.STRING(100),
			field: 'address',
			allowNull: false,
			defaultValue: '',
			comment: '收货地址'
		},

		status: {
			type: Sequelize.TINYINT(1),
			field: 'status',
			allowNull: false,
			defaultValue: 1,
			comment: '状态0禁用1正常'
		},

		position: {
			type: Sequelize.STRING(20),
			field: 'position',
			allowNull: false,
			defaultValue: '',
			comment: '职位'
		},

		rp: {
			type: Sequelize.STRING(20),
			field: 'rp',
			allowNull: false,
			defaultValue: '无',
			comment: '与其主关系人'
		},

		sp: {
			type: Sequelize.STRING(20),
			field: 'sp',
			allowNull: false,
			defaultValue: '无',
			comment: '与其次关系人'
		},

		tp: {
			type: Sequelize.STRING(20),
			field: 'tp',
			allowNull: false,
			defaultValue: '无',
			comment: '与其三关系人'
		},

		primaryRelationship: {
			type: Sequelize.INTEGER,
			field: 'primaryRelationship',
			allowNull: false,
			defaultValue: 0,
			comment: '主关系'
		},

		secondaryRelationship: {
			type: Sequelize.INTEGER,
			field: 'secondaryRelationship',
			allowNull: false,
			defaultValue: 0,
			comment: '次关系'
		},

		thirdRelationship: {
			type: Sequelize.INTEGER,
			field: 'thirdRelationship',
			allowNull: false,
			defaultValue: 0,
			comment: '三关系'
		}

	},
	{
		// 如果为 true 则表的名称和 model 相同，即 user
  	// 为 false MySQL 创建的表名称会是复数 users
  	// 如果指定的表名称本就是复数形式则不变
		freezeTableName: true,

		//自定义表名
		tableName: 'heli_user',

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
User.sync({force: false});

module.exports = User;