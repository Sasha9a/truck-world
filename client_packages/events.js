const Enterprises = require(`./ft_Enterprises`).Enterprises;
let WorkBrowser;
let BackgroundBrowser;
let Route;
let MarkerFinish;
let SphereFinish;

mp.events.add('startGame', (data, money) => {
	mp.gui.chat.activate(true);
	mp.gui.chat.show(true);

	if (data) {
		let en = JSON.parse(data);
		for (let i = 0; en.length > i; i++) {
			Enterprises.AddEnterprises(en[i].position, en[i].name);
		}
	}

	BackgroundBrowser = mp.browsers.new('package://cef/money/index.html');
	BackgroundBrowser.execute(`setMoney('${money}');`);
});

mp.events.add('playerEnterColshape', (shape) => {
	if (Enterprises.isSphere(shape) !== -1) {
		mp.events.callRemote('LoadOrders', Enterprises.isSphere(shape));
	} else if (shape === SphereFinish) {
		if (mp.players.local.vehicle) {
			Route.setRoute(false);
			Route.destroy();
			MarkerFinish.destroy();
			SphereFinish.destroy();
			mp.events.callRemote('finishWork');
		}
	}
});

mp.events.add('addMoneyWork', (money) => {
	if (BackgroundBrowser.active) {
		BackgroundBrowser.execute(`setMoney('${money}');`);
	}
});

mp.events.add('ResLoadOrders', (data) => {
	WorkBrowser = mp.browsers.new('package://cef/listWorks/index.html');
	WorkBrowser.execute("mp.invoke('focus', true)");
	WorkBrowser.execute(`setOrders('${data}');`);
	mp.gui.chat.activate(false);
	mp.gui.chat.show(false);
});

mp.events.add('clickStartWork', (id) => {
	closeWorkBrowser();
	mp.events.callRemote('SetWork', id);
});

mp.events.add('createRoute', (vector) => {
	let vec = JSON.parse(vector);
	Route = mp.blips.new(67, new mp.Vector3(vec.x, vec.y, vec.z), {
		name: 'Грузовик',
		scale: 1,
		color: 3,
		shortRange: false,
		dimension: mp.players.local.dimension
	});
	Route.setRoute(true);
});

mp.events.add('startDriveWork', (vector) => {
	Route.setRoute(false);
	Route.destroy();
	let vec = JSON.parse(vector);
	Route = mp.blips.new(38, new mp.Vector3(vec.x, vec.y, vec.z), {
		name: 'Разгрузка',
		scale: 1,
		color: 46,
		shortRange: false,
		dimension: mp.players.local.dimension
	});
	Route.setRoute(true);
	MarkerFinish = mp.markers.new(1, new mp.Vector3(vec.x, vec.y, vec.z - 1.0), 5, {
		color: [255, 255, 0, 128],
		visible: true
	});
	SphereFinish = mp.colshapes.newSphere(vec.x, vec.y, vec.z + 0.5, 4);
});

mp.events.add("playerCreateWaypoint", (position) => {
	mp.events.callRemote('setPos', position);
});

mp.keys.bind(0x09, true, () => { // TAB
	if (WorkBrowser.active) {
		closeWorkBrowser();
	}
});

const closeWorkBrowser = () => {
	WorkBrowser.execute("mp.invoke('focus', false)");
	WorkBrowser.active = false;
	mp.gui.chat.activate(true);
	mp.gui.chat.show(true);
}