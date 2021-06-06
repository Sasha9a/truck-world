const Order = require('./models/Order');
const Enterprise = require('./models/Enterprise');

mp.events.addCommand('addorder', (player, fullText) => {
	let split;
	if (fullText) {
		split = fullText.split(' ');
	} else {
		split = [];
	}
	if (split.length < 5) return player.outputChatBox(`Введите: /addorder [Id предприятия откуда] [Id предприятия куда] [Цена] [Модель авто] [Название товара]`);
	Enterprise.findByStaticID(split[0], (err, enterprise) => {
		if (err) return console.error(err);
		if (!enterprise) {
			return player.outputChatBox(`Нет предприятия с таким Id`);
		}
		Enterprise.findByStaticID(split[1], (err, enterprise) => {
			if (err) return console.error(err);
			if (!enterprise) {
				return player.outputChatBox(`Нет предприятия с таким Id`);
			}
			if (split[2] <= 0) {
				return player.outputChatBox(`Цена не может быть отрицательной`);
			}
			const newOrder = new Order({
				from: split[0],
				to: split[1],
				price: split[2],
				model: split[3],
				title: split[4]
			});
			Order.addOrder(newOrder, (err) => {
				if (err) return console.error(err);
				player.outputChatBox(`Заказ ${split[4]} успешно создан!`);
			});
		});
	});
});