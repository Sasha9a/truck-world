const {db, findAccount} = require('./parseData.js');

mp.events.addCommand('getmoney', (player) => {
	let id = findAccount(player.name);
	if (id !== -1) {
		player.outputChatBox(`У вас в кармане сейчас \$${db.accounts[id].money}`);
	} else {
		console.log(`[ERROR] Ошибка в команде getMoney`);
	}
});

mp.events.addCommand('addenter', (player, fullText) => {
	if (fullText === undefined) {
		player.outputChatBox(`Введите: /addenter {название предприятия}`);
		return;
	}
	db.addEnterprises({id: db.enterprises.length, name: fullText,
		position: {x: player.position.x, y: player.position.y, z: player.position.z}});
	let position = player.position;
	player.call('addEnterprise', [JSON.stringify(position), fullText]);
});