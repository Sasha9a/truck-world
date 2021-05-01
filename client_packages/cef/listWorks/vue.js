new Vue({
	el: '#app',
	data: {
		orders: [
			{id: 0, title: 'Сахар', model: 'packer', distance: 2568.5, price: 400}
		]
	},
	methods: {
		setOrders(data) {
			this.orders = JSON.parse(data);
		},
		btnClick(id) {
			mp.trigger('clickStartWork', id);
		}

	}
});