'use strict';

module.exports = function(App) {

  App.SignupRoute = Ember.Route.extend({
    model: function() {
      return this.store.createRecord('user');
    }
  });

  /**
   * TODO: document me
   */
  App.SignupController = Ember.ObjectController.extend({
    actions: {
      signup: function() {
        var self = this;
        var session = self.get('session');

        self.set('error', undefined);
        self.get('model').save() // create the user
        .then(function() {
          session.login({ username: self.get('model.username') });
          self.transitionToRoute('profile');
        })
        .catch(function(error) {
          if (error.responseJSON) { error = error.responseJSON; }
          if (error.error) { error = error.error; }
          self.set('error', error);
        });
      }
    }
  });

};
