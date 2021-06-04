const Enterprise = require('./models/Enterprise');

function checkStaticID(i) {
	Enterprise.findByStaticID(i, (err, enterprise) => {
		if (err) {
			console.error(err);
			return -1;
		}
		if (!enterprise) {
			return i;
		} else {
			checkStaticID(++i);
		}
	});
	return 0;
}

mp.events.addCommand('addenter', (player, name) => {
	if (!name) return player.outputChatBox(`Введите: /addenter [Название предприятия]`);
	player.outputChatBox(`Ожидайте...`);
	let i = checkStaticID(0);
	if (i !== -1) {
		const enter = new Enterprise({
			static_id: i,
			name: name
		});
		Enterprise.addEnterprise(enter, (err, enterprise) => {
			if (err) return console.error(err);
			else {
				player.outputChatBox(`Предприятие ${name} создано! Перейдите к точке где будет панель заказов и нажмите на H`);
				player.setVariable('isCreateEnter', 1);
				player.setVariable('create_enter_id', enterprise._id);
			}
		});
	} else {
		player.outputChatBox(`Произошла ошибка`);
	}
});

mp.events.add('createEnterprise', (player) => {
	if (player.getVariable('isCreateEnter') === 1) {
		const pos = {
			x: player.position.x.toFixed(3),
			y: player.position.y.toFixed(3),
			z: player.position.z.toFixed(3)
		}
		Enterprise.setPos(player.getVariable('create_enter_id'), pos);
		player.setVariable('isCreateEnter', 2);
		player.outputChatBox(`Координаты записаны! Теперь выйдите на свободное место и нажмите на H`);
	} else if (player.getVariable('isCreateEnter') === 2) {
		let car = mp.vehicles.new(mp.joaat('pounder2'),
			new mp.Vector3(player.position.x, player.position.y, player.position.z), {
				heading: player.heading,
				color: [[0, 0, 0], [255, 255, 255]],
				dimension: player.dimension,
				numberPlate: 'OX647P'
			});
		player.setVariable('id_car_enter', car.id);
		player.setVariable('isCreateEnter', 3);
		player.putIntoVehicle(car, 0);
		player.outputChatBox(`Припаркуйте грузовик, где будут спавнится рабочий транспорт`);
	} else if (player.getVariable('isCreateEnter') === 3) {
		if (player.vehicle) {
			const pos = {
				x: player.vehicle.position.x.toFixed(3),
				y: player.vehicle.position.y.toFixed(3),
				z: player.vehicle.position.z.toFixed(3),
				heading: player.vehicle.rotation.z.toFixed(3)
			}
			Enterprise.setTS(player.getVariable('create_enter_id'), pos);
			player.setVariable('isCreateEnter', 4);
			mp.vehicles.at(player.getVariable('id_car_enter')).destroy();
			player.outputChatBox(`Координаты записаны! Теперь идите на точку, куда будут выгружаться груз`);
		}
	} else if (player.getVariable('isCreateEnter') === 4) {
		const pos = {
			x: player.position.x.toFixed(3),
			y: player.position.y.toFixed(3),
			z: player.position.z.toFixed(3)
		}
		Enterprise.setFin(player.getVariable('create_enter_id'), pos);
		player.setVariable('isCreateEnter', 0);
		player.outputChatBox(`Координаты записаны! Процесс создания предприятия окончен`);
		Enterprise.findById(player.getVariable('create_enter_id'), (err, enterprise) => {
			if (err) return console.error(err);
			mp.players.forEach((p, id) => {
				p.call('addEnterprise_event', enterprise.position, enterprise.name);
			});
		});
	}
});