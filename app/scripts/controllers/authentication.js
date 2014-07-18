'use strict';

module.exports = function(App) {

  App.LoginController = Ember.Controller.extend({
    actions: {
      authenticate: function() {
        var self = this;
        var session = self.get('session');
        var credentials = self.getProperties('username', 'password');
        self.set('error', undefined);
        self.set('password', undefined);
        session.authenticate(credentials).then(function() {
          var attemptedTransition = self.get('attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            self.set('attemptedTransition', null);
          } else {
            self.transitionToRoute('profile');
          }
        })
        .catch(function(error) {
          self.set('error', error);
        });
      }
    }
  });

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
