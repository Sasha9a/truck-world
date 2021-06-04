const Enterprises = require(`./ft_Enterprises`).Enterprises;

mp.keys.bind(0x48, true, () => { // H
	mp.events.callRemote('createEnterprise');
});

mp.events.add('addEnterprise_event', (pos, name) => {
	Enterprises.AddEnterprises(pos, name);
});