let pool = require('./db')


let User = {

  findByName(username, cb) {
    let sql1 = 'SELECT id FROM ety_user WHERE username = ? LIMIT 1';
    let params1 = username
    pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query(sql1, params1, function (err, result) {
        if (err) {
          return console.log(err.message)
        }
        return cb && cb(result)

      })
    })
  },


  create(user, cb) {
    let sql = 'INSERT INTO ety_user (username,password,create_time) VALUES (?,?,now())'
    let sqlParams = [user.username, user.password]
    pool.getConnection(function (err, connection) {
      connection.query(sql, sqlParams, function (err, result) {
        if (err) {
          return console.log(err.message)
        }
        return cb && cb()
      });
    })
  },


  /*
  * params:{username,id}
  * */
  login(params, cb, errorCb) {
    let sql2 = 'SELECT id FROM ety_user WHERE username = ? AND password = ?'
    let params2 = [params.username, params.password]
    pool.getConnection(function (err, connection) {
      if (err) throw err
      connection.query(sql2, params2, function (err, result) {
        if (err) {
          return console.log(err.message)
        }
        return cb && cb(result)
      })
    })

  },

  checkPassword(params, cb) {
    let sql2 = 'SELECT id FROM ety_user WHERE username = ? AND password = ?'
    let params2 = [params.username, params.oldPassword];
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err)
      }
      connection.query(sql2, params2, function (err, result) {
        if (err) {
          return console.log(err.message)

        }
        cb && cb(result)
      })

    })
  },

  changePassword(params, cb) {
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err)
      }
      let sql3 = 'UPDATE ety_user SET password = ? where username = ? AND password = ?'
      let params3 = [params.newPassword, params.username, params.oldPassword]

      connection.query(sql3, params3, function (err, result) {
        if (err) {
          return console.log(err.message)
        }
        cb && cb()
      })
    });
  },

}


module.exports = User

