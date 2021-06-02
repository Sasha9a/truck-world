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

module.exports.addEnterprise = function (newEnter, callback) {
	newEnter.save(callback);
}

module.exports.setPos = function (id, newPos) {
	Enterprise.findById(id, (err, enterprise) => {
		if (err) return console.error(err);
		enterprise.position = newPos;
		enterprise.save((err) => {
			if (err) return console.error(err);
		});
	});
}

module.exports.setTS = function (id, newPos) {
	Enterprise.findById(id, (err, enterprise) => {
		if (err) return console.error(err);
		enterprise.truckSpawn = newPos;
		enterprise.save((err) => {
			if (err) return console.error(err);
		});
	});
}

module.exports.setFin = function (id, newPos) {
	Enterprise.findById(id, (err, enterprise) => {
		if (err) return console.error(err);
		enterprise.finish = newPos;
		enterprise.save((err) => {
			if (err) return console.error(err);
		});
	});
}