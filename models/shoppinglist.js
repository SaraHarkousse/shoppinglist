var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird'); //ADD THIS LINE
Promise.promisifyAll(mongoose); //AND THIS LINE

var ShoppingItemSchema = new Schema({
  text: {type: 'String', required: true},
  done: {type: 'Boolean'}
});
var ShoppingItem = mongoose.model('ShoppingItem', ShoppingItemSchema);

module.exports = ShoppingItem;
