let Base = require('./base')

class Collect extends Base {

  create(params, cb) {
    let sqlStr = 'INSERT INTO rel_collect_article (user_id,article_id,create_time) VALUES (?,?,now())'
    let {user_id, article_id} = params
    let sqlParams = [user_id, article_id]
    this.query(sqlStr, sqlParams, cb)
  }

  findAllByUserId(params, cb) {
    // 碎觉觉 明天写
  }

}


module.exports = Collect