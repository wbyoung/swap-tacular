'use strict';

module.exports = function(App) {

  App.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {
    beforeModel: function() {
      return this.get('session');
    }, 
    model: function() {
      return this.store.find('post', { user: this.get('session.id') });
    }
  });

  App.ProfileController = Ember.ArrayController.extend({
    itemController: 'post',
    sortProperties: ['createdAt'],
    sortAscending: false  
  });

};
