mp.events.add('playerJoin', (player) => {
	player.heading = -90.0;
	player.position = new mp.Vector3(1182.484, -3256.521, 6.029);
	player.model = mp.joaat('s_m_m_autoshop_01');
	player.call('startGame');
});