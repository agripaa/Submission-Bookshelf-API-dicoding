const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('book', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: DataTypes.STRING,
    year: DataTypes.INTEGER,
    author: DataTypes.STRING,
    summary: DataTypes.TEXT,
    publisher: DataTypes.STRING,
    pageCount: DataTypes.INTEGER,
    readPage: DataTypes.INTEGER,
    finished: DataTypes.BOOLEAN,
    reading: DataTypes.BOOLEAN,
    insertedAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});

module.exports = Book;