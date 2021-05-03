const fs = require('fs');
const fileOrders = './packages/TruckWorld/data/Orders.json';
const fileAccounts = './packages/TruckWorld/data/Accounts.json';
const fileEnterprises = './packages/TruckWorld/data/Enterprises.json';

class Data {
	constructor() {
		this.orders = [
			// {id: 0, model: "", title: "", from: 0, to: 1, price: 0}
		];
		this.accounts = [
			// {id: 0, name: "", money: 0}
		];
		this.enterprises = [
			// {id: 0, name: "", position: {x: 0, y: 0, z: 0}, truckSpawn: {x: 0, y: 0, z: 0, heading: 0}, finish: {x: 0, y: 0, z: 0}}
		];
	}

	setOrders(data) {
		this.orders = data;
	}
	addOrder(data) {
		this.orders.push(data);
		fs.writeFileSync(fileOrders, JSON.stringify(this.orders, null, '\t'));
	}

	setAccounts(data) {
		this.accounts = data;
	}
	giveMoney(id, money) {
		this.accounts[id].money += money;
		fs.writeFileSync(fileAccounts, JSON.stringify(this.accounts, null, '\t'));
	}
	addAccount(data) {
		this.accounts.push(data);
		fs.writeFileSync(fileAccounts, JSON.stringify(this.accounts, null, '\t'));
	}

	setEnterprises(data) {
		this.enterprises = data;
	}
	addEnterprises(data) {
		this.enterprises.push(data);
		fs.writeFileSync(fileEnterprises, JSON.stringify(this.enterprises, null, '\t'));
	}
}

const db = new Data();

mp.events.add('packagesLoaded', () => {
	let data = fs.readFileSync(fileAccounts, 'utf-8');
	if (data.length !== 0) {
		db.setAccounts(JSON.parse(data));
	}
	data = fs.readFileSync(fileEnterprises, 'utf-8');
	if (data.length !== 0) {
		db.setEnterprises(JSON.parse(data));
	}
	data = fs.readFileSync(fileOrders, 'utf-8');
	if (data.length !== 0) {
		db.setOrders(JSON.parse(data));
	}
	console.log('[DONE] Loaded all resources successfully!');
});

module.exports.db = db;

const findAccount = (name) => {
	for (let i = 0; db.accounts.length > i; i++) {
		if (name === db.accounts[i].name) {
			return i;
		}
	}
	return -1;
}

module.exports.findAccount = findAccount;

