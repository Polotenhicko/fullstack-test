const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

module.exports = new Sequelize(dbConfig);