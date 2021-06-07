let vue = new Vue({
	el: '#app',
	data: {
		money: 0
	}
});

function setMoney(money) {
	vue.money = money;
}