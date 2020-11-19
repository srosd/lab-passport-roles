const { redBright } = require('chalk');
const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => res.render('index'));

router.get('/user-page', (req, res, next)=>{
    if(req.user){
        res.render('userPage')
    } else {
        res.redirect('/');
    }
});

module.exports = router;
