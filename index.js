var express = require('express');
var router = express.Router();
//var login = require('../html/index.html')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
//router.post('/login', login)

module.exports = router;