'use strict';

module.exports = function(App) {
  var attr = DS.attr;
  App.User = DS.Model.extend({
    username: attr('string'),
    password: attr('string')
  });

  App.Post = DS.Model.extend({
    user: DS.belongsTo('user'),
    date: attr('date'),
    content: attr('string')
  });

};
