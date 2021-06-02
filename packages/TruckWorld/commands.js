const fs = require("fs");
const Account = require('./models/Account');

mp.events.addCommand('save', (player, name = "No name") => {
	const saveFile = "savedpos.txt";
	let pos = (player.vehicle) ? player.vehicle.position : player.position;
	let rot = (player.vehicle) ? player.vehicle.rotation : player.heading;
	let string = "Position: " + pos.x.toFixed(3).toString() + ", " + pos.y.toFixed(3)
		+ ", " + pos.z.toFixed(3) + " | ";
	if (player.vehicle) {
		string += "Rotation: " + rot.x.toFixed(3) + ", " + rot.y.toFixed(3) + ", " + rot.z.toFixed(3)
			+ " | InCar - " + name + "\r\n";
	} else {
		string += "Heading: " + rot.toFixed(3) + " | OnFoot - " + name + "\r\n";
	}

	fs.appendFile(saveFile, string, (err) => {
		if (err) {
			player.notify(`~r~Произошла ошибка: ~w~${err.message}`);
		} else {
			player.notify(`~g~Координаты сохранены. ~w~(${name})`);
		}
	});
});

mp.events.addCommand('getmoney', (player) => {
	Account.findById(player.getVariable('user_id'), (err, account) => {
		if (err) throw err;
		if (account) {
			player.outputChatBox(`У вас в кармане сейчас \$${account.money}`);
		} else {
			console.log(`[ERROR] Ошибка в команде getMoney`);
		}
	});
});