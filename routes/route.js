let express = require('express')
let router = express.Router()
let User = require('./../models/user')
let Article = require('./../models/article')

let user = new User()
let article = new Article()


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
  let title = req.param('title')
  let content = req.param('content')
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
  let title = req.param('title')
  let content = req.param('content')
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

router.get('/api/article/delete',function (req,res,next) {
  let articleId = req.param('id')
  let userId = req.session.userId
  article.findById(articleId,function (result) {
    if(!result.length){
      return res.send('no such an article exist')
    }else if(result[0].user_id !== userId){
      return res.send('Permission denied')
    }else if(result[0].is_delete){
      return res.send('the article has been deleted already')
    }
    article.deleteById(articleId,function (result) {
      res.send('delete success')
    })
  })
})


module.exports = router