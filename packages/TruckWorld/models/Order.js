const mongoose = require('mongoose');

const ModelOrder = mongoose.Schema({
	model: String,
	title: String,
	from: Number,
	to: Number,
	price: Number
}, { versionKey: false });

const Order = module.exports = mongoose.model('Order', ModelOrder);

module.exports.findAll = function (callback) {
	Order.find(callback);
}

module.exports.addOrder = function (newOrder, callback) {
	newOrder.save(callback);
}