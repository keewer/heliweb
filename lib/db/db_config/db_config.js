const Sequelize = require('sequelize');

module.exports = new Sequelize(config.mysqlOptions.database, config.mysqlOptions.user, config.mysqlOptions.password, {

	host: config.mysqlOptions.host,

	dialect: config.mysqlOptions.dialect,

	pool: config.mysqlOptions.pool,

	defined: {
		underscored: false
	}
});