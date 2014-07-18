'use strict';

module.exports = function(App) {

  App.CreateRoute = Ember.Route.extend({
    actions: {
      post: function() {
        var self = this;
        var content = this.controllerFor('create').get('inputPost');
        var post = this.store.createRecord('post', {
          content: content
        });

        this.controllerFor('create').set('inputPost', '');
        post.save().then(function() {
          self.transitionTo('index');
        });
      }
    }
  });

};
