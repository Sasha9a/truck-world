class ft_Enterprises {
	constructor() {
		this.enterprises = [];
	}

	AddEnterprises(position, name) {
		position.z -= 1.0;
		mp.markers.new(1, position, 1, {
			color: [255, 0, 0, 128],
			visible: true
		});
		mp.blips.new(351, new mp.Vector3(position.x, position.y, 0), {
			name: name,
			color: 25,
			shortRange: true,
			scale: 1.5
		});
		this.enterprises.push({
			sphere: mp.colshapes.newSphere(position.x, position.y, position.z + 0.5, 1),
			position: position
		});
	}

	isSphere(sp) {
		for (let i = 0; this.enterprises.length > i; i++) {
			if (this.enterprises[i].sphere === sp) {
				return true;
			}
		}
		return false;
	}
}

const Enterprises = new ft_Enterprises();

exports.Enterprises = Enterprises;