import { SHARED_CONSTANTS } from '@shared/constants';

mp.events.add('playerReady', () => {
	mp.console.logInfo(`${mp.players.local.name} is ready!`);
	mp.console.logInfo(SHARED_CONSTANTS.HELLO_WORLD);

	mp.players.local.customProperty = 1;
	mp.console.logInfo(`customProperty: ${mp.players.local.customProperty}`);

	mp.players.local.customMethod = () => {
		mp.console.logInfo(`customMethod called.`);
	};

	mp.players.local.customMethod();
});

mp.events.add('PED:giveWeapon', (ped: PedMp) => {
	ped.giveWeapon(mp.game.joaat('weapon_assaultrifle_mk2'), 1000, true);
});

mp.events.add('PED:setArmour', (ped: PedMp) => {
	ped.setArmour(100);
});
