var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

var express = require('express');
var router = express.Router();

router.get('/app', function(req, res, next) {
  res.render('users/app', { title: 'User Management' });
});

module.exports = router;
