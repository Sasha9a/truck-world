const Enterprises = require(`./ft_Enterprises`).Enterprises;
let WorkBrowser;

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

mp.events.add('ResEnterprises', (data) => {
	if (data !== undefined) {
		let en = JSON.parse(data);
		for (let i = 0; en.length > i; i++) {
			Enterprises.AddEnterprises(en[i].position, en[i].name);
		}
	}
});

mp.events.add('addEnterprise', (position, fullText) => {
	Enterprises.AddEnterprises(JSON.parse(position), fullText);
});

mp.events.add('playerEnterColshape', (shape) => {
	let id = Enterprises.isSphere(shape);
	if (id !== -1) {
		WorkBrowser = mp.browsers.new('package://cef/listWorks/index.html');
		WorkBrowser.execute("mp.invoke('focus', true)");
		mp.events.callRemote('LoadOrders', id);
		mp.gui.chat.activate(false);
		mp.gui.chat.show(false);
	}
});

mp.events.add('ResLoadOrders', (data) => {
	if (WorkBrowser.active) {
		WorkBrowser.execute(`setOrders(\'${data}\');`);
	}
});

mp.events.add('clickStartWork', (id) => {
	closeWorkBrowser();
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