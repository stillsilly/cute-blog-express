let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let session = require('express-session')
let route = require('./routes/route')
let sessionConfig = require('./config/session')

let indexRouter = require('./routes/index')
let usersRouter = require('./routes/users')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 使用 session 中间件
app.use(session({
  name: 'uid',
  secret: sessionConfig.secret, // 对session id 相关的cookie 进行签名
  resave: true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie: {
    maxAge: sessionConfig.maxAge, // 设置 session 的有效时间，单位毫秒
  },
}))


app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/users11', usersRouter)
app.use('/', route)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
