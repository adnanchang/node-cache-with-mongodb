var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({
    message: 'Hi there, here goes nothing (actually quite a lot) in building a quick express app for Fashion Cloud'
  });
});

module.exports = router;
