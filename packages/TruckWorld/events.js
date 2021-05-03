const {db, findAccount} = require('./Data.js');

mp.events.add('playerJoin', (player) => {
	player.model = mp.joaat('s_m_m_autoshop_01');
	player.position = new mp.Vector3(88.986, -2587.935, 6.005);

	let id = findAccount(player.name);
	if (id === -1) {
		db.addAccount({id: db.accounts.length, name: player.name, money: 100});
		id = db.accounts.length;
	}
	console.log(`Присоеденился к игре ${db.accounts[id].name}: Состояние \$${db.accounts[id].money}`);
	player.call('startGame');
});

mp.events.add('playerEnterVehicle', (player, vehicle, seat) => {
	if (player.getVariable('car') === vehicle.id) {
		let order = db.orders[player.getVariable('OrderID')];
		let to = db.enterprises[order.to];
		player.call('startDriveWork', [JSON.stringify(new mp.Vector3(to.finish.x, to.finish.y, to.finish.z))]);
		player.outputChatBox('Маршрут проложен. Езжайте до конечной точки');
	}
});

mp.events.add('LoadEnterprises', (player) => {
	player.call('ResEnterprises', [JSON.stringify(db.enterprises)]);
});

mp.events.add('LoadOrders', (player, id) => {
	let isWork = player.getVariable('WordDriver');
	let res = [];
	if (isWork) {
		player.outputChatBox(`Вы не выполнили предыдущий заказ!`);
	} else {
		for (let i = 0; i < db.orders.length; i++) {
			if (db.orders[i].id === id) {
				res.push({
					id: db.orders[i].id,
					title: db.orders[i].title,
					model: db.orders[i].model,
					distance: Math.abs(Math.sqrt(Math.pow((db.enterprises[db.orders[i].to].finish.x - db.enterprises[db.orders[i].from].truckSpawn.x),2)
						+ Math.pow((db.enterprises[db.orders[i].to].finish.y - db.enterprises[db.orders[i].from].truckSpawn.y),2)
						+ Math.pow((db.enterprises[db.orders[i].to].finish.z - db.enterprises[db.orders[i].from].truckSpawn.z),2))).toFixed(1),
					price: db.orders[i].price
				});
			}
		}
		player.call('ResLoadOrders', [JSON.stringify(res)]);
	}
});

mp.events.add('SetWork', (player, id) => {
	let order = db.orders[id];
	let from = db.enterprises[order.from];
	let car = mp.vehicles.new(mp.joaat(order.model),
		new mp.Vector3(from.truckSpawn.x, from.truckSpawn.y, from.truckSpawn.z), {
		heading: from.truckSpawn.heading,
		color: [[0, 0, 0], [255, 255, 255]],
		dimension: player.dimension,
		numberPlate: 'OX647P'
	});
	player.call('createRoute', [JSON.stringify(new mp.Vector3(from.truckSpawn.x, from.truckSpawn.y, from.truckSpawn.z))]);
	player.setVariable('WordDriver', true);
	player.setVariable('car', car.id);
	player.setVariable('OrderID', id);
	player.outputChatBox(`Вы взяли заказ. На миникарте отмечена точка вашего грузовика.`);
});

mp.events.add('finishWork', (player) => {
	player.setVariable('WordDriver', false);
	let id = findAccount(player.name);
	let order = db.orders[player.getVariable('OrderID')];
	db.giveMoney(id, order.price);
	mp.vehicles.at(player.getVariable('car')).destroy();
	player.outputChatBox(`Вы успешно доставили груз. Вы заработали: \$${order.price}`);
});