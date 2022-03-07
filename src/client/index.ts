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
	mp.game.weapon.giveWeaponObjectToPed(mp.game.joaat('weapon_assaultrifle_mk2'), ped.id);
});

mp.events.add('PED:setArmour', (ped: PedMp) => {
	ped.setArmour(100);
});

mp.events.add('render', () => {
	mp.peds.forEach((ped) => {
		if (ped.doesExist()) {
			mp.game.invoke("0xBF0FD6E56C964FCB", ped.handle,  mp.game.joaat("weapon_assaultrifle_mk2"), 100, 0, 1);
			mp.game.invoke("0x428CA6DBD1094446", ped.handle, 0);
		}
	});
});
