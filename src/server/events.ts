mp.events.add('playerJoin', (player) => {
	player.model = mp.joaat('s_m_y_marine_03');
	player.position = new mp.Vector3(88.986, -2587.935, 6.005);
	player.armour = 100;

	player.giveWeapon(mp.joaat('weapon_assaultrifle_mk2'), 1000);
});
