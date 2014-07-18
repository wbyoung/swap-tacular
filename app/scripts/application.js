'use strict';

var App = window.App = Ember.Application.create();
App.AdmitOneContainers = {}; //overridable by tests
Ember.AdmitOne.setup( { containers: App.AdmitOneContainers });
require('./models.js')(App);
require('./router.js')(App);
require('./controllers/authentication.js')(App);

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

// https://github.com/twbs/bootstrap/issues/9013
$(document).on('click.nav', '.navbar-collapse.in', function(e) {
  if($(e.target).is('a') || $(e.target).is('button')) {
    $(this).collapse('hide');
  }
});
