var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysqlConfig = require('./../config/mysql');

var pool = mysql.createPool(mysqlConfig);

console.log(pool)

/* GET user  */
router.get('/api/user', function (req, res, next) {
    res.send('api user');
});


/* user */
router.get('/api/user/register', function (req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        let username = req.param('username');
        let password = req.param('password');
        console.log(username,password);

        if(!username){
            return res.send('username cant be empty')
        }
        if(!password){
            return res.send('password cant be empty')
        }
        if(username.length<2){
            return res.send('username must be more than 1 letter')
        }
        if(password.length<2){
            return res.send('password must be more than 1 letter')
        }
        let sql1 = 'SELECT id FROM ety_user where username = ? LIMIT 1';
        let params1 = username;
        connection.query(sql1,params1,function (err, result) {
            if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
            }
            if(result.length){
                res.send('存在同名账号，请换一个名字');
                return next();
            }


            let sql = 'INSERT INTO ety_user (username,password,create_time) VALUES (?,?,now())';
            let sqlParams = [username,password];
            connection.query(sql,sqlParams,function (err, result) {
                if(err){
                    console.log('[INSERT ERROR] - ',err.message);
                    return;
                }
                console.log('--------------------------INSERT----------------------------');
                //console.log('INSERT ID:',result.insertId);
                console.log('INSERT ID:',result);
                console.log('-----------------------------------------------------------------\n\n');
            });
            res.send('register success');


        });


    });
});

router.get('/api/user/login', function (req, res, next) {
    let username = req.param('username');
    let password = req.param('password');

    if(!username){
        return res.send('username cant be empty')
    }
    if(!password){
        return res.send('password cant be empty')
    }

    pool.getConnection(function(err, connection) {
        if (err) throw err;
        let sql1 = 'SELECT id FROM ety_user WHERE username = ? LIMIT 1';
        let params1 = username;
        connection.query(sql1,params1,function (err, result) {
            if(err) {
                return console.log('[INSERT ERROR] - ', err.message)

            }
            if(!result.length){
                return res.send('no such a username')
            }

            let sql2 = 'SELECT id FROM ety_user WHERE username = ? AND password = ?';
            let params2 = [username,password];

            connection.query(sql2,params2,function (err, result) {
                if(err) {
                    return console.log('[INSERT ERROR] - ', err.message)

                }
                if(result.length){
                    return res.send('login success')
                }else {
                    return res.send('username or password error')
                }
            })

        })

    });
});


router.get('/api/user/password', function (req, res, next) {
    let username = req.param('username');
    let oldPassword = req.param('oldPassword');
    let newPassword = req.param('newPassword');

    if(!username){
        return res.send('username cant be empty')
    }
    if(!oldPassword){
        return res.send('oldPassword cant be empty')
    }
    if(!newPassword){
        return res.send('newPassword cant be empty')
    }
    if(newPassword.length<2){
        return res.send('password must be more than 1 letter')
    }

    pool.getConnection(function (err,connection) {
        if(err){
            console.log(err)
        }
        let sql1 = 'SELECT id FROM ety_user WHERE username = ? LIMIT 1'
        let params1 = username;
        connection.query(sql1,params1,function (err, result) {
            if(err) {
                return console.log('[INSERT ERROR] - ', err.message)

            }
            if(!result.length){
                return res.send('no such a username')
            }

            let sql2 = 'SELECT id FROM ety_user WHERE username = ? AND password = ?'
            let params2 = [username,oldPassword];

            connection.query(sql2,params2,function (err, result) {
                if(err) {
                    return console.log('[INSERT ERROR] - ', err.message)

                }
                if(!result.length){
                    return res.send('old password dont match username')
                }

                let sql3 = 'UPDATE ety_user SET password = ? where username = ? AND password = ?'
                let params3 = [newPassword,username,oldPassword]
                connection.query(sql3,params3,function (err,result) {
                    if(err) {
                        return console.log('[INSERT ERROR] - ', err.message)
                    }
                    return res.send('change password success')
                })
            })

        })
    });
});


/* article */
router.get('/api/article/create', function (req, res, next) {
    let userId = req.param('userId');  // 如果有cookie,就不需要userId
    let title = req.param('title');
    let content = req.param('content');
    let tagList = req.param('tagList');
    let categoryId = req.param('categoryId');

    res.send('create article success');
});


router.get('/api/article/create', function (req, res, next) {
    let articleId = req.param('articleId');
    let title = req.param('title');
    let content = req.param('content');
    let tagList = req.param('tagList');
    let categoryId = req.param('categoryId');

    res.send('create article success');
});


module.exports = router;