var express = require('express');
 var router = express.Router();

 var ShoppingItem = require('../../models/shoppinglist');

 router.route('/')
   .get(function(req, res, next) {
     ShoppingItem.findAsync({})
     .then(function(items) {
       res.json(items);
     })
     .catch(next)
     .error(console.error);
   });

 module.exports = router;
