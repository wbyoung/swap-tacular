'use strict';

module.exports = function(App) {
  var Model = DS.Model;
  var attr = DS.attr;
  var belongsTo = DS.belongsTo;
  var hasMany = DS.hasMany;

  App.User = Model.extend({
    username: attr('string'),
    password: attr('string'),
    posts: hasMany('post', { async: true }),
    comments: hasMany('comment', { async: true })
  });

  App.Post = Model.extend({
  	message: attr('string'),
  	createdAt: attr('date'),
  	user: belongsTo('user'),
    comments: hasMany('comment', { async: true })
  });

  App.Comment = Model.extend({
    message: attr('string'),
    createdAt: attr('date'),
    user: belongsTo('user'),
    post: belongsTo('post')
  });
};
