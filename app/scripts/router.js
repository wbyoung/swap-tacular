'use strict';

module.exports = function(App) {
  App.Router.map(function() {
    this.route('signup');
    this.route('login');
    this.route('logout');
    this.route('profile');
    this.resource('post', {path: '/post/:postId'}, function() {
      this.resource('comments');
    });
    this.route('create');
  });
};
