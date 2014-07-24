'use strict';

module.exports = function(App) {
  var Model = DS.Model;
  var attr = DS.attr;
  var belongsTo = DS.belongsTo;
  var hasMany = DS.hasMany;

  App.User = Model.extend({
    username: attr('string'),
    password: attr('string'),
    posts: hasMany('post'),
    comments: hasMany('comment')
  });

  App.Post = Model.extend({
  	message: attr('string'),
  	createdAt: attr('date'),
  	user: belongsTo('user'),
    comments: hasMany('comment')
  });

  App.Comment = Model.extend({
    message: attr('string'),
    createdAt: attr('date'),
    user: belongsTo('user'),
    post: belongsTo('post')
  });
};
