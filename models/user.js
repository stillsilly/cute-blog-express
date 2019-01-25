let Base = require('./base')

class User extends Base {

  findByName(username, cb) {
    let sqlStr = 'SELECT id FROM ety_user WHERE username = ? LIMIT 1'
    let sqlParams = username
    this.query(sqlStr, sqlParams, cb)
  }

  create(user, cb) {
    let sqlStr = 'INSERT INTO ety_user (username,password,create_time) VALUES (?,?,now())'
    let sqlParams = [user.username, user.password]
    this.query(sqlStr, sqlParams, cb)
  }

  login(params, cb) {
    let sqlStr = 'SELECT id FROM ety_user WHERE username = ? AND password = ?'
    let sqlParams = [params.username, params.password]
    this.query(sqlStr, sqlParams, cb)
  }

  checkPassword(params, cb) {
    let sqlStr = 'SELECT id FROM ety_user WHERE username = ? AND password = ?'
    let sqlParams = [params.username, params.oldPassword];
    this.query(sqlStr, sqlParams, cb)
  }

  changePassword(params, cb) {
    let sqlStr = 'UPDATE ety_user SET password = ? where username = ? AND password = ?'
    let sqlParams = [params.newPassword, params.username, params.oldPassword]
    this.query(sqlStr, sqlParams, cb)
  }

}

module.exports = User

