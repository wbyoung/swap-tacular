'use strict';

module.exports = function(App) {
  App.CommentsRoute = Ember.Route.extend({
    model: function() {
      console.log('finding comments');
      //There ought to be a better way to get postID is user refreshes here..
      var currentURL = Ember.Location._location.hash;
      var altpID = currentURL.replace('#/post/', '').replace('/comments', '');
      var pID = this.controllerFor('post').get('id');
      if (pID === undefined) { pID = altpID; }
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