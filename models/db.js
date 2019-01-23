var mysql = require('mysql')
var mysqlConfig = require('./../config/mysql')
var pool = mysql.createPool(mysqlConfig)

module.exports = pool