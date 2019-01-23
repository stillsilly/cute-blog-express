let pool = require('./db')

let Article = {

  create(params, cb) {
    let sql = 'INSERT INTO ety_article (title,content,tag,category_id,create_time,user_id) VALUES (?,?,?,?,now(),?)'
    let {title, content, tagList, categoryId, userId} = params
    let sqlParams = [title, content, tagList, categoryId, userId]
    pool.getConnection(function (err, connection) {
      if (err) {
        return console.log(err)
      }

      connection.query(sql, sqlParams, function (err, result) {
        if (err) {
          return console.log(err)
        }
        cb && cb(result)
      })
    })
  },


  update(params, cb) {

    // TODO 这里应该where article_id   还是where article_id and user_id  哪个更快？？
    let sql = 'UPDATE ety_article SET title=?,content=?,tag=?,category_id=?,update_time=now() WHERE id = ?'
    console.log(params)
    let {title, content, tagList, categoryId, articleId} = params
    let sqlParams = [title, content, tagList, categoryId, articleId]
    pool.getConnection(function (err, connection) {
      if (err) {
        return console.log(err)
      }
      connection.query(sql, sqlParams, function (err, result) {
        if (err) {
          return console.log(err)
        }
        cb && cb()
      })
    })
  }
}

module.exports = Article