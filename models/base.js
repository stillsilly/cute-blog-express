let mysql = require('mysql')
let mysqlConfig = require('./../config/mysql')
let pool = mysql.createPool(mysqlConfig)

class Base {

  constructor(){

  }

  query(sqlStr,sqlParams,cb,errorCb){
    pool.getConnection(function (err,connection) {
      if(err){
        return console.log(err)
      }
      connection.query(sqlStr,sqlParams,function (err, result) {
        if(err){
          return console.log(err)
        }
        cb && cb(result)
      })
    })
  }

}

module.exports = Base