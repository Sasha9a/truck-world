const Enterprises = require(`./ft_Enterprises`).Enterprises;

mp.keys.bind(0x48, true, () => { // H
	mp.events.callRemote('createEnterprise');
});

mp.events.add('addEnterprise_event', (data) => {
	let d = JSON.parse(data);
	Enterprises.AddEnterprises(d.position, d.name);
});