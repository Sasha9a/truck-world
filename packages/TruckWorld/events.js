const Account = require('./models/Account');
const Enterprise = require('./models/Enterprise');
const Order = require('./models/Order');

// Коннект игрока
mp.events.add('playerJoin', (player) => {
	player.model = mp.joaat('s_m_m_autoshop_01');
	player.position = new mp.Vector3(88.986, -2587.935, 6.005);

	let user;
	Account.findByName(player.name, (err, account) => {
		if (err) return console.error(err);
		if (!account) {
			const acc = new Account({
				name: player.name
			});
			Account.addAccount(acc, (err, account) => {
				if (err) return console.error(err);
				user = account;
				console.log(`Аккаунт ${player.name} успешно создан!`);
			});
		} else {
			user = account;
		}
		console.log(`Присоединился к игре ${user.name}: Состояние \$${user.money}`);
		Enterprise.findAll((err, enterprises) => {
			if (err) return console.error(err);
			player.call('startGame', [JSON.stringify(enterprises), user.money]);
		});
		player.setVariable('user_id', user._id);
	});
});

mp.events.add('playerEnterVehicle', (player, vehicle, seat) => {
	if (player.getVariable('car') === vehicle.id) {
		Order.findById(player.getVariable('OrderID'), (err, order) => {
			if (err) return console.error(err);
				Enterprise.findByStaticID(order.to, (err, enterprise) => {
					if (err) return console.error(err);
					player.call('startDriveWork', [JSON.stringify(new mp.Vector3(
						enterprise.finish.x, enterprise.finish.y, enterprise.finish.z
					))]);
					player.outputChatBox('Маршрут проложен. Езжайте до конечной точки');
				});
		});
	}
});

mp.events.add('LoadOrders', (player, id) => {
	let res = [];
	if (player.getVariable('WordDriver')) {
		player.outputChatBox(`Вы не выполнили предыдущий заказ!`);
	} else {
		Order.findAll((err, orders) => {
			if (err) return console.error(err);
			Enterprise.findAll((err, enterprises) => {
				if (err) return console.error(err);
				for (let i = 0; i < orders.length; i++) {
					if (orders[i].from === id) {
						res.push({
							id: orders[i]._id,
							title: orders[i].title,
							model: orders[i].model,
							distance: mp.Vector3.Distance(enterprises.find((e) => e.static_id === orders[i].from).truckSpawn,
								enterprises.find((e) => e.static_id === orders[i].to).finish),
							price: orders[i].price
						});
					}
				}
				player.call('ResLoadOrders', [JSON.stringify(res)]);
			});
		});
	}
});

mp.events.add('SetWork', (player, id) => {
	Order.findById(id, (err, order) => {
		if (err) return console.error(err);
		Enterprise.findByStaticID(order.from, (err, enterprise) => {
			if (err) return console.error(err);
			let car = mp.vehicles.new(mp.joaat(order.model),
				new mp.Vector3(enterprise.truckSpawn.x, enterprise.truckSpawn.y, enterprise.truckSpawn.z), {
					heading: enterprise.truckSpawn.heading,
					color: [[0, 0, 0], [255, 255, 255]],
					dimension: player.dimension,
					numberPlate: 'OX647P'
				});
			player.call('createRoute', [JSON.stringify(
				new mp.Vector3(enterprise.truckSpawn.x, enterprise.truckSpawn.y, enterprise.truckSpawn.z
				))]);
			player.setVariable('WordDriver', true);
			player.setVariable('car', car.id);
			player.setVariable('OrderID', id);
			player.outputChatBox(`Вы взяли заказ. На миникарте отмечена точка вашего грузовика.`);
		});
	});
});

mp.events.add('finishWork', (player) => {
	player.setVariable('WordDriver', false);
	Account.findByName(player.name, (err, account) => {
		if (err) return console.error(err);
		Order.findById(player.getVariable('OrderID'), (err, order) => {
			if (err) return console.error(err);
			Account.giveMoney(player.name, order.price, (err) => {
				if (err) return console.error(err);
				player.call('addMoneyWork', [account.money + order.price]);
				mp.vehicles.at(player.getVariable('car')).destroy();
				player.outputChatBox(`Вы успешно доставили груз. Вы заработали: \$${order.price}`);
			});
		});
	});
});

mp.events.add('setPos', (player, position) => {
	if (player.vehicle && !player.seat) {
		player.vehicle.position = new mp.Vector3(position.x, position.y, position.z + 2);
	} else {
		player.position = new mp.Vector3(position.x, position.y, position.z + 1);
	}
});