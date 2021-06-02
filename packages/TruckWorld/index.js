// Подключение библиотек
const mongoose = require('mongoose');

// Подключение конфиг
const db = require('./config');

// Подключение к бд
mongoose.connect(db.db, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected', () => {
	console.log('Успешное подключение к БД!');
});

mongoose.connection.on('error', (err) => {
	console.log('Ошибка подключения к БД: ' + err);
});

require('./api');
require('./events.js');
require('./commands.js');