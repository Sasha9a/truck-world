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
});

mp.events.add('LoadEnterprises', (player) => {
	player.call('ResEnterprises', [JSON.stringify(db.enterprises)]);
});