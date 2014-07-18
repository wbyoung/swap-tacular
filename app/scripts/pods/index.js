'use strict';

module.exports = function(App) {

  App.IndexRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('post');
    }
  });

  App.IndexController = Ember.ArrayController.extend({
    itemController: 'post',
    sortProperties: ['createdAt'],
    sortAscending: false
  });

};
