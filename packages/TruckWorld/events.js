const {db, findAccount} = require('./parseData.js');

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

	// let car = mp.vehicles.new(mp.joaat('pounder2'),
	// 	new mp.Vector3(db.enterprises[0].truckSpawn.x, db.enterprises[0].truckSpawn.y, db.enterprises[0].truckSpawn.z), {
	// 	heading: db.enterprises[0].truckSpawn.heading,
	// 	color: [[0, 0, 0], [255, 255, 255]],
	// 	dimension: player.dimension,
	// 	numberPlate: 'OX647P'
	// });
});

mp.events.add('LoadEnterprises', (player) => {
	player.call('ResEnterprises', [JSON.stringify(db.enterprises)]);
});

mp.events.add('LoadOrders', (player, id) => {
	let res = [];
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
});