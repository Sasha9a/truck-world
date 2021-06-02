const mongoose = require('mongoose');

const ModelEnterprise = mongoose.Schema({
	static_id: Number,
	name: String,
	position: {
		x: Number,
		y: Number,
		z: Number
	},
	truckSpawn: {
		x: Number,
		y: Number,
		z: Number,
		heading: Number
	},
	finish: {
		x: Number,
		y: Number,
		z: Number
	}
}, { versionKey: false });

const Enterprise = module.exports = mongoose.model('Enterprise', ModelEnterprise);

module.exports.findAll = function (callback) {
	Enterprise.find(callback);
}

module.exports.findByStaticID = function (id, callback) {
	Enterprise.findOne({static_id: id}, callback);
}