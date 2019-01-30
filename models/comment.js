let Base = require('./base')

class Comment extends Base{

  findById(params, cb) {
    let sqlStr = 'SELECT user_id,is_delete FROM ety_comment WHERE id = ?'
    this.query(sqlStr, params, cb)
  }

  findAllByArticleId(params,cb){
    // 删了的不拿
    let sqlStr = 'SELECT user_id,is_delete,content FROM ety_comment WHERE article_id = ? AND is_delete=0'
    this.query(sqlStr, params, cb)
  }

  create(params, cb) {
    let sqlStr = 'INSERT INTO ety_comment (user_id,content,article_id,create_time) VALUES (?,?,?,now())'
    let {user_id,content,article_id} = params
    let sqlParams = [user_id,content,article_id]
    this.query(sqlStr, sqlParams, cb)
  }

  deleteById(sqlParams, cb) {
    let sqlStr = 'UPDATE ety_comment SET is_delete = 1,delete_time = now() WHERE id = ?'
    this.query(sqlStr, sqlParams, cb)
  }

}


module.exports = Comment