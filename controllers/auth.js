const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')

router.get('/register', (req, res, next) => {
    res.render('register.ejs')
  })
  
router.get('/login', (req,res, next)=> {
    res.render('login.ejs')
})

// Reg Page Route 
router.post('/registration', (req, res, next) => {
    const password = req.body.password;
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const userDbEntry = {};
    userDbEntry.username = req.body.username;
    userDbEntry.password = passwordHash
    User.create(userDbEntry, (err, user) => {
        req.session.username = user.username;
        req.session.logged   = true;
        req.session.currentUser = user
        res.redirect('/users')
    });
})

//Login Page Route
router.post('/login', (req, res, next) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if(user){
                if(bcrypt.compareSync(req.body.password, user.password)){
                    req.session.message  = '';
                    req.session.username = req.body.username;
                    req.session.logged   = true;
                    req.session.currentUser = user
                    res.redirect('/users')
                } else {
                req.session.message = 'Username or password are incorrect';
                res.redirect('/auth/login')
                }
        } else {
            req.session.message = 'Username or password are incorrect';
            res.redirect('/auth/login')
        }
    });
})

router.get('/logout', (req, res) => {
    req.session.destroy(function(err){
          if(err){
          console.log(err)
        } else {
            res.redirect('/')
        }
    })
  })
  

module.exports = router