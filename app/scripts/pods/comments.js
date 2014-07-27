'use strict';

module.exports = function(App) {
  App.CommentsRoute = Ember.Route.extend({
    model: function() {
      console.log('finding comments');
      var currentURL = Ember._location.hash;
      console.log(Ember.Location._location.hash);
      var pID = this.controllerFor('post').get('id');
      return this.store.find('comment', {user: this.get('session.id'), post: pID});
    }
  });

  App.CommentRoute = Ember.Route.extend({
      model: function() {
      console.log('finding comments');
      return this.store.find('comment');
    }
  });

  App.CommentsAdapter = DS.Adapter.extend({
    namespace: 'api'
  });

  App.CommentsIndexRoute = Ember.Route.extend({

  });

};