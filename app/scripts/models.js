'use strict';

module.exports = function(App) {
  var attr = DS.attr;
  App.User = DS.Model.extend({
    username: attr('string'),
    password: attr('string')
  });
  App.Post = DS.Model.extend({
  	content: attr('string'),
  	userID: DS.belongsTo('user')
  });
};
