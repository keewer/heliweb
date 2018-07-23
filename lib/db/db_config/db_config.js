const Sequelize = require('sequelize');

module.exports = new Sequelize(config.mysqlOptions.database, config.mysqlOptions.user, config.mysqlOptions.password, {

	host: config.mysqlOptions.host,

	dialect: config.mysqlOptions.dialect,

	pool: config.mysqlOptions.pool,

	timezone: '+08:00',

	defined: {
		underscored: false
	}
});