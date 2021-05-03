const Enterprises = require(`./ft_Enterprises`).Enterprises;
let WorkBrowser;
let Route;
let MarkerFinish;
let SphereFinish;

mp.events.add('startGame', () => {
	mp.gui.chat.activate(true);
	mp.gui.chat.show(true);

	mp.game.ped.removeScenarioBlockingArea(0, true);
	mp.game.streaming.setPedPopulationBudget(3);
	mp.game.ped.setCreateRandomCops(true);
	mp.game.vehicle.setRandomBoats(true);
	mp.game.vehicle.setRandomTrains(true);
	mp.game.vehicle.setGarbageTrucks(true);
	mp.game.streaming.setVehiclePopulationBudget(3);
	mp.game.invoke('0x34AD89078831A4BC'); // SET_ALL_VEHICLE_GENERATORS_ACTIVE
	mp.game.vehicle.setAllLowPriorityVehicleGeneratorsActive(true);
	mp.game.vehicle.setNumberOfParkedVehicles(-1);
	mp.game.vehicle.displayDistantVehicles(true);
	mp.game.graphics.disableVehicleDistantlights(false);

	mp.events.callRemote('LoadEnterprises');
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

mp.events.add('ResEnterprises', (data) => {
	if (data !== undefined) {
		let en = JSON.parse(data);
		for (let i = 0; en.length > i; i++) {
			Enterprises.AddEnterprises(en[i].position, en[i].name);
		}
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