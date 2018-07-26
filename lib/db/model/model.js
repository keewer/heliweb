const User = require(__basename + '/lib/db/model/user.js');

const Order = require(__basename + '/lib/db/model/order.js');

const Product = require(__basename + '/lib/db/model/product.js');

module.exports = {
	User,
	Order,
	Product
}