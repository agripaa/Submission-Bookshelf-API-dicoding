const Sequelize = require('sequelize');

const db = new Sequelize('sub-dicoding', 'root', 'mamank546', {
    host: 'localhost',
    dialect: 'mysql',
    port: 8111,
})

module.exports = db;