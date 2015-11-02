//js/models/todo.js


var app = app || {};

//Todo model
//Has 'title' and 'completed' attr

app.Todo = Backbone.Model.extend({

  //Default attr
  defaults: {
    title: '',
    completed: false
  },

  //Toggle completed
  toggle: function(){
    this.save({
      completed: !this.get('completed')
    });
  }
})
