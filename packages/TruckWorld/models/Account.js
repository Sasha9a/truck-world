const mongoose = require('mongoose');

const ModelAccount = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	money: {
		type: Number,
		default: 100
	}
}, { versionKey: false });

const Account = module.exports = mongoose.model('Account', ModelAccount);

module.exports.addAccount = function (newAccount, callback) {
	newAccount.save(callback);
}

module.exports.findByName = function (name, callback) {
	Account.findOne({name: name}, callback);
}

module.exports.giveMoney = function (name, money, callback) {
	Account.updateOne({name: name}, {$inc: {money: money}}, callback);
}