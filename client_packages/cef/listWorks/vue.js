let vue = new Vue({
	el: '#app',
	data: {
		orders: [
			// {id: 0, title: 'Сахар', model: 'packer', distance: 2568.5, price: 400}
		]
	},
	methods: {
		btnClick(id) {
			mp.trigger('clickStartWork', id);
		}
	}
});

function setOrders(data) {
	vue.orders = JSON.parse(data);
}