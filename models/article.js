let Base = require('./base')

class Article extends Base {

  findById(params, cb) {
    let sqlStr = 'SELECT user_id,is_delete FROM ety_article WHERE id = ?'
    this.query(sqlStr, params, cb)
  }

  create(params, cb) {
    let sqlStr = 'INSERT INTO ety_article (title,content,tag,category_id,create_time,user_id) VALUES (?,?,?,?,now(),?)'
    let {title, content, tagList, categoryId, userId} = params
    let sqlParams = [title, content, tagList, categoryId, userId]
    this.query(sqlStr, sqlParams, cb)
  }


  update(params, cb) {

    // TODO 这里应该where article_id   还是where article_id and user_id  哪个更快？？
    let sqlStr = 'UPDATE ety_article SET title=?,content=?,tag=?,category_id=?,update_time=now() WHERE id = ?'
    let {title, content, tagList, categoryId, articleId} = params
    let sqlParams = [title, content, tagList, categoryId, articleId]
    this.query(sqlStr, sqlParams, cb)
  }

  deleteById(sqlParams, cb) {
    let sqlStr = 'UPDATE ety_article SET is_delete = 1,delete_time = now() WHERE id = ?'
    this.query(sqlStr, sqlParams, cb)
  }

  getDetailById(sqlParams, cb) {
    let sqlStr = 'SELECT id,title,content,user_id,create_time,update_time,tag,read_count,is_delete FROM ety_article WHERE id = ?'
    this.query(sqlStr, sqlParams, cb)
  }

  updateReadCount(sqlParams, cb) {
    let sqlStr = 'UPDATE ety_article SET read_count = read_count + 1 WHERE id = ?'
    this.query(sqlStr, sqlParams, cb)
  }

}

module.exports = Article