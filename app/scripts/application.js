'use strict';

var App = window.App = Ember.Application.create();
App.AdmitOneContainers = {}; //overridable by tests
Ember.AdmitOne.setup( { containers: App.AdmitOneContainers });
require('./models.js')(App);
require('./router.js')(App);

require('./pods/create.js')(App);
require('./pods/index.js')(App);
require('./pods/login.js')(App);
require('./pods/logout.js')(App);
require('./pods/post.js')(App);
require('./pods/profile.js')(App);
require('./pods/signup.js')(App);

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

// https://github.com/twbs/bootstrap/issues/9013
$(document).on('click.nav', '.navbar-collapse.in', function(e) {
  if($(e.target).is('a') || $(e.target).is('button')) {
    $(this).collapse('hide');
  }
});
