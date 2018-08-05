const Sequelize = require('sequelize');

const Order = sequelize.define(
	'order', 
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			field: 'id',
			autoIncrement: true,
			allowNull: false,
			comment: '主键'
		},

		orderNo: {
			type: Sequelize.STRING(255),
			field: 'orderNo',
			allowNull: false,
			defaultValue: '',
			comment: '订单编号'
		},

		productNo: {
			type: Sequelize.STRING(255),
			field: 'productNo',
			allowNull: false,
			defaultValue: '',
			comment: '商品编号'
		},

		name: {
			type: Sequelize.STRING(20),
			field: 'name',
			allowNull: false,
			defaultValue: '',
			comment: '商品名称'
		},

		price: {
			type: Sequelize.INTEGER,
			field: 'price',
			allowNull: false,
			defaultValue: 0,
			comment: '商品价格'
		},

		count: {
			type: Sequelize.INTEGER,
			field: 'count',
			allowNull: false,
			defaultValue: 0,
			comment: '商品数量'
		},

		money: {
			type: Sequelize.INTEGER,
			field: 'money',
			allowNull: false,
			defaultValue: 0,
			comment: '付款金额'
		},

		uid: {
			type: Sequelize.INTEGER.UNSIGNED,
			field: 'uid',
			allowNull: false,
			defaultValue: 0,
			comment: '用户id'
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
			defaultValue: 0,
			comment: '状态0未付款1待发货2待收货3已收货4删除'
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
		},

		auth: {
			type: Sequelize.TINYINT(1),
			field: 'auth',
			allowNull: false,
			defaultValue: -1,
			comment: '权限4分销商'
		},

		firstLevel: {
			type: Sequelize.DECIMAL(10, 2),
			field: 'firstLevel',
			allowNull: false,
			defaultValue: 0,
			comment: '一级返利'
		},

		secondLevel: {
			type: Sequelize.DECIMAL(10, 2),
			field: 'secondLevel',
			allowNull: false,
			defaultValue: 0,
			comment: '二级返利'
		},

		thirdLevel: {
			type: Sequelize.DECIMAL(10, 2),
			field: 'thirdLevel',
			allowNull: false,
			defaultValue: 0,
			comment: '三级返利'
		},

		payTime:{
			type: Sequelize.DATE,
			field: 'payTime',
			allowNull: true,
			comment: '订单付款时间'
		},

		sendTime: {
			type: Sequelize.DATE,
			field: 'sendTime',
			allowNull: true,
			comment: '订单发货时间'
		},

		receiveTime: {
			type: Sequelize.DATE,
			field: 'receiveTime',
			allowNull: true,
			comment: '订单收货时间'
		}


	},
	{
		// 如果为 true 则表的名称和 model 相同，即 user
  	// 为 false MySQL 创建的表名称会是复数 users
  	// 如果指定的表名称本就是复数形式则不变
		freezeTableName: true,

		//自定义表名
		tableName: 'heli_order',

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
Order.sync({force: false});

module.exports = Order;