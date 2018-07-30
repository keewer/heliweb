const User = require(__basename + '/lib/db/model/user.js');

const Order = require(__basename + '/lib/db/model/order.js');

const Product = require(__basename + '/lib/db/model/product.js');

const Promote = require(__basename + '/lib/db/model/promote.js');

const Comment = require(__basename + '/lib/db/model/comment.js');

module.exports = {
	User,
	Order,
	Product,
	Promote,
	Comment
}