// js/collections/todo.js



var app = app || {};

//Todo collections

//Back up the collection of todos with HTML5 local storage, not DB

var TodoList = Backbone.Collection.extend({

    //Reference the todo model in ~/js/models/todo.js
    model: app.Todo,

    //Save items under todos-backbone namespace
    localStorage: new Backbone.LocalStorage('todos-backbone'),

    //Filter so only have finished items
    completed: function(){
      return this.filter(function( todo ) {
        return todo.get('completed');
      });
    },

    //Filter so only have unfininished items
    remaining: function(){
      return this.without.apply(this, this.completed() );
    },

    //Generate next order number for new items. We store by GUID tho
    nextOrder: function() {
      if ( !this.length ) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    //Sort comparator for original insertion order
    comparator: function ( todo ) {
      return todo.get('order');
    }
});

//Create global collection of todos
app.Todos = new TodoList()
