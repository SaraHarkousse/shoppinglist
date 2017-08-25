var express = require('express');
var router = express.Router();
var ShoppingItem = require('../../models/shoppinglist');

/* GET shopping list. */
router.get('/', function(req, res, next) {
  ShoppingItem.findAsync({}, null, {sort: {"_id":1}})
  .then(function (shoppinglist) {
    res.render('shoppinglist', {title: 'Shopping List', shoppinglist: shoppinglist});
  })
  .catch(next)
  .error(console.error);

  // ShoppingItem.find(function(err, shoppinglist) {
  //   if (err) return console.error(err);
  //   console.log('####################################################################################');
  //   console.log(shoppinglist);
  // });

});

module.exports = router;
