var express = require('express');
var router = express.Router();
var shoppinglist = require('../models/shoppinglist');

/* GET shopping list. */
router.get('/', function(req, res, next) {
  res.render('shoppinglist', {title: 'Shopping List', shoppinglist: shoppinglist});
});

module.exports = router;
