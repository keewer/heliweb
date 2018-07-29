const User = require(__basename + '/lib/db/model/user.js');

const Order = require(__basename + '/lib/db/model/order.js');

const Product = require(__basename + '/lib/db/model/product.js');

const Promote = require(__basename + '/lib/db/model/promote.js');

module.exports = {
	User,
	Order,
	Product,
	Promote
}