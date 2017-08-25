var express = require('express');
var router = express.Router();

var ShoppingItem = require('../../models/shoppinglist');

router.route('/')
  .get(function(req, res, next) {
    ShoppingItem.findAsync({}, null, {sort: {"_id":1}})
    .then(function(items) {
      res.json(items);
    })
    .catch(next)
    .error(console.error);
  })
  .post(function (req, res, next) {
    var item = new ShoppingItem();
    item.text = req.body.text;
    item.saveAsync()
    .then(function (item) {
      console.log("success");
      res.json({'status':'success', 'item':item});
    })
    .catch(function (e) {
      console.log('fail');
      res.json({'status':'error', 'error':e});
    })
    .error(console.error);
  });

  router.route('/:id')
  .get(function (req, res, next) {
    ShoppingItem.findOneAsync({_id:req.params.id}, {text:1, done:1})
    .then(function (item) {
      res.json(item);
    })
    .catch(next)
    .error(console.error);
  })
  .put(function (req, res, next) {
    var item = {};
    var prop;
    for (prop in req.body) {
      item[prop] = req.body[prop];
    }
    ShoppingItem.updateAsync({_id: req.params.id}, item)
    .then(function (updatedItem) {
      return res.json({'status':'success', 'item':updatedItem})
    })
    .catch(function (e) {
      return res.status(400).json({'status':'fail', 'error': e});
    })
  })
  .delete(function (req, res, next) {
    ShoppingItem.findByIdAndRemoveAsync(req.params.id)
    .then(function (deletedItem) {
      res.json({'status':'success', 'item':deletedItem});
    })
    .catch(function (e) {
      res.status(400).json({'status':'fail', 'error': e});
    });
  });

 module.exports = router;
