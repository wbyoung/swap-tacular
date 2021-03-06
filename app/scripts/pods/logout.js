'use strict';

module.exports = function(App) {

  App.LogoutRoute = Ember.Route.extend({
    beforeModel: function() {
      this._super();
      var self = this;
      var session = this.get('session');
      return session.invalidate().finally(function() {
        self.transitionTo('index');
      });
    }
  });

};
