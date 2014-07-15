'use strict';

module.exports = function(App) {
  App.Router.map(function() {
    this.route('signup');
    this.route('login');
    this.route('logout');
    this.route('profile');
    this.route('create');
  });
  // authenticate any route
  App.ProfileRoute = Ember.Route.extend(Ember.AdmitOne.AuthenticatedRouteMixin, {

  });

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

  App.PostController = Ember.ObjectController.extend({
    message: Ember.computed.alias('model.content'), // TODO: content is a name that Ember doesn't like
    messageHTML: function() {
      var text = this.get('message');
      text = Ember.Handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new Ember.Handlebars.SafeString(text);
    }.property('message')
  });

  App.CreateRoute = Ember.Route.extend({
    actions: {
      post: function() {
        var content = this.controllerFor('create').get('inputPost');
        var post = this.store.createRecord('post', {
          content: content
        });

        this.controllerFor('create').set('inputPost', '');
        post.save().then(function() {
          this.transitionTo('index');
        });
      }
    }
  });

  App.LoginRoute = Ember.Route.extend({
    beforeModel: function() {
      this._super();
      if (this.get('session').get('isAuthenticated')) {
        this.transitionTo('profile');
      }
    }
  });

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

  App.SignupRoute = Ember.Route.extend({
    model: function() {
      return this.store.createRecord('user');
    }
  });
};
