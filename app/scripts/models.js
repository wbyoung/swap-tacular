'use strict';

module.exports = function(App) {
  var Model = DS.Model;
  var attr = DS.attr;
  var belongsTo = DS.belongsTo;

  App.User = Model.extend({
    username: attr('string'),
    password: attr('string')
  });

  App.Post = Model.extend({
  	message: attr('string'),
  	createdAt: attr('date'),
  	user: belongsTo('user')
  });
};
