var $ = require('jquery');
var shoppingitemTemplate = require('../views/partials/item.hbs');

$(function () {
  // addShoppingItem
  var addShoppingItem = function() {
    var text = $('#add-item-text').val();
    $.ajax({
      url: '/api/shoppinglist',
      type: 'POST',
      data: {
        text: text,
        done: false
      },
      dataType: 'json',
      success: function(data) {
        var item = data.item;
        $('form + ul').append(shoppingitemTemplate(item));
        $('#add-item-text').val('');
      }
    });
  };

 // updateShoppingItem
  var updateShoppingItem = function(id, data, cb) {
    $.ajax({
      url: '/api/shoppinglist/'+id,
      type: 'PUT',
      data: data,
      dataType: 'json',
      success: function(data) {
        cb();
      }
    });
  };

  // deleteShoppingItem
  var deleteShoppingItem = function(id, cb) {
    $.ajax({
      url: '/api/shoppinglist/'+id,
      type: 'DELETE',
      data: {
        id: id
      },
      dataType: 'json',
      success: function(data) {
        cb();
      }
    });
  };

  // helper functions
  var deleteShoppingItemLi = function($li) {
    $li.remove();
  };
  var updateItemsCount = function () {
    $(".count").text($("li").length);
  };
  $('.filter').on('click', '.show-all', function() {
    $('.hide').removeClass('hide');
  });
  $('.filter').on('click', '.show-not-done', function() {
    $('.hide').removeClass('hide');
    $('.checked').closest('li').addClass('hide');
  });
  $('.filter').on('click', '.show-done', function() {
    $('li').addClass('hide');
    $('.checked').closest('li').removeClass('hide');
  });

  // Mutation obserever on li (shopping list)
  var initListObserver = function () {
    var target = $('ul')[0];
    var config = { attributes: true, childList: true, characterData: true };
    var observer = new MutationObserver(function(mutationRecords) {
      $.each(mutationRecords, function(index, mutationRecord) {
        updateItemsCount();
      });
    });
    if(target) {
      observer.observe(target, config);
    }
    updateItemsCount();
  };

  initListObserver();

  // adding new items to the shopping list
  $('.add-item-button').on('click', addShoppingItem);

  // toggle class & update done attribute in bdd
  $('ul').on('change', 'li :checkbox', function() {
    var $this = $(this),
        $input = $this[0],
        $li = $this.parent(),
        id = $li.attr('id'),
        checked = $input.checked,
        data = { done: checked };
    updateShoppingItem(id, data, function(d) {
      $this.next().toggleClass('checked');
    });
  });

  // when the user presses the return key after entering the item text
  $(":text").on('keypress',function(e) {
   var key = e.keyCode;
   if( key == 13 || key == 169) {
     addShoppingItem();
     e.preventDefault();
     e.stopPropagation();
     return false;
   }
  });

  // edit the item content
  $('ul').on('keydown', 'li span', function(e) {
   var $this = $(this),
       $span = $this[0],
       $li = $this.parent(),
       id = $li.attr('id'),
       key = e.keyCode,
       target = e.target,
       text = $span.innerHTML,
       data = { text: text};
   $this.addClass('editing');
   if(key === 27) { //escape key
     $this.removeClass('editing');
     document.execCommand('undo');
     target.blur();
   } else if(key === 13) { //enter key
     updateShoppingItem(id, data, function(d) {
       $this.removeClass('editing');
       target.blur();
     });
     e.preventDefault();
   }
  });

  // delete an item
  $('ul').on('click', 'li a', function() {
    var $this = $(this),
    $input = $this[0],
    $li = $this.parent(),
    id = $li.attr('id');
    deleteShoppingItem(id, function(e){
      deleteShoppingItemLi($li);
    });
  });

  // delete all
  $(".clear").on("click", function() {
    var $doneLi = $(".checked").closest("li");
    for (var i = 0; i < $doneLi.length; i++) {
      var $li = $($doneLi[i]); //you get a li out, and still need to convert into $li
      var id = $li.attr('id');
      (function($li){
        deleteShoppingItem(id, function(){
          deleteShoppingItemLi($li);
        });
      })($li);
    }
  });

});
