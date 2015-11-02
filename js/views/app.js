// js/views/app.js

var app = app || {};

//The application

//The overall appview is the top level piece of UI
app.AppView = Backbone.View.extend({

  //Dont generate a new element, just bind to the existing skeleton
  //already present in the HTML.
  el: '#todoapp',

  //Template for the line of stats at the bottom
  statsTemplate: _.template( $('#stats-template').html() ),

  //Delegated events for creating new items, clearing complete ones.
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  //At init bind the relevant events on the todos collections
  //when items are added or changed.
  initialize: function(){
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);

    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos, 'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);

    app.Todos.fetch();
  },

  //Re-rendering the app just refreshes the stats, nothing else
  render: function() {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if ( app.Todos.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },


  //Add a single item by creating a view for it, and then
  //append it to the <ul>
  addOne:  function( todo ){
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },

  //Add all items in the collection at once
  addAll: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  },

  filterOne: function ( todo ){
    todo.trigger('visible');
  },

  filterAll: function() {
    app.Todos.each(this.filterOne, this);
  },

  //Generate attr for a new item
  newAttributes: function(){
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  //On hitting return in the main input field, create new model
  createOnEnter: function( event ){
    if( event.which != ENTER_KEY || !this.$input.val().trim() ){
      return;
    }

    app.Todos.create( this.newAttributes() );
    this.$input.val('');
  },

  //clear all created items, destroy their models
  //PRoper clean up
  clearCompleted: function(){
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  //Make all of them completed
  toggleAllComplete: function(){
    var completed = this.allCheckbox.checked;

    app.Todos.each(function( todo ){
      todo.save({
        'completed': completed
      });
    });
  }
});
