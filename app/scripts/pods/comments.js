'use strict';

module.exports = function(App) {
  App.CommentsRoute = Ember.Route.extend({
    model: function() {
      return this.store.find('comment');
    }
  });

  App.CommentsIndexRoute = Ember.Route.extend({

  });

};