'use strict';

module.exports = function(App) {

  App.LoginRoute = Ember.Route.extend({
    beforeModel: function() {
      this._super();
      if (this.get('session').get('isAuthenticated')) {
        this.transitionTo('profile');
      }
    }
  });

  /**
   * TODO: document me
   */
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

};
