let express = require('express')
let router = express.Router()
let User = require('./../models/user')
let Article = require('./../models/article')
let Comment = require('./../models/comment')


let user = new User()
let article = new Article()
let comment = new Comment()


/* GET user  */
router.get('/api/user', function (req, res, next) {
  res.send('api user')
})


/* user */
router.get('/api/user/register', function (req, res, next) {

  let username = req.param('username')
  let password = req.param('password')


  if (!username) {
    return res.send('username cant be empty')
  }
  if (!password) {
    return res.send('password cant be empty')
  }
  if (username.length < 2) {
    return res.send('username must be more than 1 letter')
  }
  if (password.length < 2) {
    return res.send('password must be more than 1 letter')
  }

  user.findByName(username, (result) => {
    if (result.length) {
      return res.send('存在同名账号，请换一个名字')
    }

    // TODO 这个东东可以不写在回调里吗……   要怎么处理……  丑死了
    user.create({username, password}, (result) => {
      res.send('register success')
    })
    // TODO create 这个函数需要处理注册失败的情况吗？？  或者以后统一在某个地方处理？？

  })

})

router.get('/api/user/login', function (req, res, next) {
  let username = req.param('username')
  let password = req.param('password')
  if (!username) {
    return res.send('username cant be empty')
  }
  if (!password) {
    return res.send('password cant be empty')
  }

  user.findByName(username, (result) => {
    if (!result.length) {
      return res.send('no such a username')
    }
    user.login({username, password}, (result) => {
      if (result.length) {
        req.session.userName = username
        req.session.userId = result[0].id
        return res.send('login success')
      } else {
        return res.send('username or password error')
      }
    })
  })
})


router.get('/api/user/password', function (req, res, next) {
  let username = req.param('username')
  let oldPassword = req.param('oldPassword')
  let newPassword = req.param('newPassword')

  if (!username) {
    return res.send('username cant be empty')
  }
  if (!oldPassword) {
    return res.send('oldPassword cant be empty')
  }
  if (!newPassword) {
    return res.send('newPassword cant be empty')
  }
  if (newPassword.length < 2) {
    return res.send('password must be more than 1 letter')
  }

  user.findByName(username, (result) => {
    if (!result.length) {
      return res.send('no such a username')
    }
    user.checkPassword({username, oldPassword}, (result) => {
      if (!result.length) {
        return res.send('old password dont match username')
      }
      user.changePassword({username, newPassword}, () => {
        return res.send('change password success')
      })
    })
  })

})

router.get('/api/user/logout', function (req, res, next) {
  if (req.session.userId) {
    req.session.userName = null
    req.session.userId = null
  }
  return res.send('logout success')   // 退出登录后的重定向让前端做吧 ？？
})


/* article */
router.get('/api/article/create', function (req, res, next) {
  if (!req.session.userId) {
    return res.send('未登录 前端重定向')
  }

  let userId = req.session.userId  // 如果有cookie,就不需要userId
  let title = (req.param('title') || '').trim()
  let content = (req.param('content') || '').trim()
  let tagList = (req.param('tagList') || []).join(',')
  let categoryId = req.param('categoryId')

  if (!title) {
    return res.send('title cant be empty')
  }
  if (!content) {
    return res.send('content cant be empty')
  }

  // TODO 需要判断数据库里有没有这个userid吗？？

  article.create({title, content, tagList, categoryId, userId}, () => {
    res.send('create article success')
  })


})


router.get('/api/article/update', function (req, res, next) {
  let articleId = req.param('articleId')
  let title = (req.param('title') || '').trim()
  let content = (req.param('content') || '').trim()
  let tagList = (req.param('tagList') || []).join(',')
  let categoryId = req.param('categoryId')

  // TODO 要不要验证存不存在这个articleId？？
  if (!title) {
    return res.send('title cant be empty')
  }
  if (!content) {
    return res.send('content cant be empty')
  }

  article.update({title, content, tagList, categoryId, articleId}, () => {
    res.send('update article success')
  })

})

router.get('/api/article/delete', function (req, res, next) {
  let articleId = req.param('id')
  let userId = req.session.userId
  article.findById(articleId, function (result) {
    if (!result.length) {
      return res.send('no such an article exist')
    } else if (result[0].user_id !== userId) {
      return res.send('Permission denied')
    } else if (result[0].is_delete) {
      return res.send('the article has been deleted already')
    }
    article.deleteById(articleId, function (result) {
      res.send('delete success')
    })
  })
})

router.get('/api/article/detail', function (req, res, next) {
  let articleId = req.param('id')
  article.getDetailById(articleId, function (result) {
    if (!result.length) {
      return res.send('no such an article exist')
    } else {
      article.updateReadCount(articleId, function () {

      })
      res.send(result[0])
    }
  })
})


// TODO 这个接口是不是叫 /api/article/comment 更好？？
router.get('/api/comment/create', function (req, res, next) {
  // TODO 这种需要登录的 统一弄个地方拦截吧  单个的路由里先不处理
  let articleId = req.param('articleId')
  let content = (req.param('content') || '').trim()
  let userId = req.session.userId

  if (!articleId) {
    return res.send('params error,need articleId')
  }

  if (!content) {
    return res.send('content cant be empty')
  }

  //  TODO 数据库的下划线  混在一起好丑怎么办   要写个函数统一处理吗？   但是如果万一有例外怎么办
  let params = {
    article_id: articleId,
    content,
    user_id: userId,
  }
  comment.create(params, function () {
    res.send('create comment success')
  })
})


// TODO 应该叫 /api/article/comments ???
router.get('/api/comment/getList', function (req, res, next) {
  //  有两个参数  一个是articleId  另个是 userId 可以获取一个人发出的所有评论  以后做
  //  要不要分成两个接口

  let articleId = req.param('articleId')
  comment.findAllByArticleId(articleId, function (result) {
    res.send(result)
  })
  // TODO 这里应该要分页  size page   先凑合着，以后加
})


router.get('/api/comment/delete', function (req, res, next) {
  let id = req.param('id')
  let userId = req.session.userId
  comment.findById(id,function (result) {
    if(!result.length){
      return res.send('cant find such a comment')
    }
    if(result[0].user_id !== userId){
      return res.send('Permission denied,its not your comment')
    }else if(result[0].is_delete === 1){
      return res.send('this comment has been deleted already')
    }
    comment.deleteById(id,function () {
      return res.send('delete success')
    })
  })
})


module.exports = router