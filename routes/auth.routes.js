const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const User    = require('../models/User.model');
const passport    = require('passport');
const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req, res, next)=>{
    if(req.user.role==='BOSS'){
        res.render('signup');
    } else {
        res.redirect('/');
    }
});

router.post('/signup', (req, res, next)=>{
    const {username, name, password, profileImg, descrition, facebookId, role} = req.body;

    if(username === '' || password === '' || name === '' || role === ''){
        res.render('signup', {errorMessage: 'You have to fill all the fields.'})
        return;
    }

    User.findOne({username})
    .then((result)=>{
      if(!result){
        bcrypt.hash(password, 10)
        .then((hashedPass)=>{
          User.create({username, name, password: hashedPass, profileImg, descrition, facebookId, role})
          .then((result)=>res.redirect('/user-page'));
        })
      } else {
        res.render('signup', {errorMessage: 'This user already exists, please try again.'});
      }
    })
    .catch((err)=>res.send(err));


});

router.get('/login', (req, res, next)=>{
    res.render('login', {errorMessage: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user-page',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  }));

router.get('/logout', (req, res, next)=>{
    req.logOut();
    res.redirect('/');
  });

router.get('/delete', (req, res, next)=>{
    res.render('delete');
});

router.post('/delete', (req, res, next)=>{
    const {username} = req.body;
    User.findOneAndDelete({username})
        .then(()=>{
            console.log('User deleted.');
            res.redirect('/user-page')
        })
        .catch((err)=>{
            res.send(err);
        })
});

module.exports = router;
